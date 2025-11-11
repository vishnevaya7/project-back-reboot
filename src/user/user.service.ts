import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {In, Like, Repository} from "typeorm";
import {User, UserRole} from "./entities/user.entity";
import * as bcrypt from 'bcryptjs'
import {CreateUserRequest, GetUserPredicate, UserListItemResponse} from "../swagger/dto";
import {Page} from "../swagger/dto/page";
import {Pageable} from "../swagger/dto/pageable";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
        // Парсим параметры сортировки из строки "field,direction"
        let sortBy = 'id';
        let sortDirection: 'ASC' | 'DESC' = 'ASC';

        if (pageable.sort) {
            const [field, direction] = pageable.sort.split(',');
            sortBy = field || 'id';
            sortDirection = (direction?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        }

        // Строим условия фильтрации
        const whereConditions: any = {};

        if (predicate) {
            // Фильтр по точным email адресам
            if (predicate.emails && predicate.emails.length > 0) {
                whereConditions.email = In(predicate.emails);
            }

            // Фильтр по частичному совпадению email
            if (predicate.emailLike) {
                whereConditions.email = Like(`%${predicate.emailLike}%`);
            }

            // Фильтр по ID пользователей
            if (predicate.ids && predicate.ids.length > 0) {
                whereConditions.id = In(predicate.ids);
            }

            // Фильтр по ролям
            if (predicate.roles && predicate.roles.length > 0) {
                // Преобразуем строки в enum значения
                const roleEnums = predicate.roles.map(role =>
                    role === 'admin' ? UserRole.ADMIN : UserRole.USER
                );
                whereConditions.role = In(roleEnums);
            }

            // Фильтр по точным username
            if (predicate.usernames && predicate.usernames.length > 0) {
                whereConditions.username = In(predicate.usernames);
            }

            // Фильтр по частичному совпадению username
            if (predicate.usernameLike) {
                whereConditions.username = Like(`%${predicate.usernameLike}%`);
            }

            // Фильтр по активности
            if (predicate.isActive !== undefined) {
                whereConditions.isActive = predicate.isActive;
            }
        }

        // Получаем общее количество пользователей с учетом фильтров
        const total = await this.userRepository.count({ where: whereConditions });

        // Получаем пользователей с пагинацией, сортировкой и фильтрацией
        const users = await this.userRepository.find({
            where: whereConditions,
            skip: (pageable.page - 1) * pageable.size,
            take: pageable.size,
            order: {
                [sortBy]: sortDirection
            }
        });

        // Преобразуем User в UserListItemResponse
        const userListItems: UserListItemResponse[] = users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
        }));

        // Возвращаем объект Page
        return new Page<UserListItemResponse>(
            userListItems,
            total,
            pageable.page,
            pageable.size,
            sortBy,
            sortDirection
        );
    }
}
