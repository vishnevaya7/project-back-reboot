import {ConflictException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User, UserRole} from "./entities/user.entity";
import * as bcrypt from 'bcryptjs'
import {CreateUserDto} from "./dto/create-user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
    }

    async create(createUserDto: CreateUserDto): Promise<User> {
        try {
            const { username, email, password } = createUserDto;
            const existingUser = await this.userRepository.findOne({
                where: { email }
            });

            if (existingUser) {
                throw new ConflictException('Пользователь с таким email уже существует');
            }
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const user = this.userRepository.create({
                username,
                email,
                passwordHash,
                isActive: true,
            });

            return await this.userRepository.save(user);
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Такого пользователя не существует ' + error);
        }
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async validatePassword(user: User, password: string): Promise<boolean> {
        return await bcrypt.compare(password, user.passwordHash);
    }

}
