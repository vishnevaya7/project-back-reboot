import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Like, Repository} from "typeorm";
import {User, UserRole} from "./entities/user.entity";
import * as bcrypt from 'bcryptjs'
import {CreateUserRequest, GetUserPredicate, UserListItemResponse} from "../swagger/dto";
import {Page} from "../swagger/dto/page";
import {Pageable} from "../swagger/dto/pageable";
import {UserRepository} from "./user.repository";

@Injectable()
export class UserService {
    constructor(
        private userRepository: UserRepository,
    ) {
    }

    async create(createUserRequest: CreateUserRequest): Promise<User> {
        try {
            const {username, email, password, role} = createUserRequest;
            const existingUser = await this.userRepository.findOne({
                where: {email}
            });

            if (existingUser) {
                throw new ConflictException('Пользователь с таким email уже существует');
            }
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            // Преобразуем строку роли в enum
            const userRole = role === 'admin' ? UserRole.ADMIN : UserRole.USER;

            const user = this.userRepository.create({
                username,
                email,
                passwordHash,
                isActive: true,
                role: userRole,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Ошибка при создании пользователя: ' + error);
        }
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({where: {id}});
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({where: {email}});
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.passwordHash);
    }


    async findUsers(pageable: Pageable, predicate?: GetUserPredicate): Promise<Page<UserListItemResponse>> {

        const whereConditions: any = {};
        if (predicate) {
            if (predicate.emails && predicate.emails.length > 0) {
                whereConditions.email = In(predicate.emails);
            }
            if (predicate.emailLike) {
                whereConditions.email = Like(`%${predicate.emailLike}%`);
            }
            if (predicate.ids && predicate.ids.length > 0) {
                whereConditions.id = In(predicate.ids);
            }
            if (predicate.roles && predicate.roles.length > 0) {
                const roleEnums = predicate.roles.map(role => role === 'admin' ? UserRole.ADMIN : UserRole.USER);
                whereConditions.role = In(roleEnums);
            }
            if (predicate.usernames && predicate.usernames.length > 0) {
                whereConditions.username = In(predicate.usernames);
            }
            if (predicate.usernameLike) {
                whereConditions.username = Like(`%${predicate.usernameLike}%`);
            }
            if (predicate.isActive !== undefined) {
                whereConditions.isActive = predicate.isActive;
            }
        }

        const userPage = await this.userRepository.getPage(pageable, whereConditions);

        return userPage.map<UserListItemResponse>(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }));

    }
}
