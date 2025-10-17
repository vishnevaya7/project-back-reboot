import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateUserRoleEnum1678901234567 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Создаем enum тип в PostgreSQL
        await queryRunner.query(`
            CREATE TYPE user_role AS ENUM ('user', 'admin')
        `);

        // Добавляем колонку role к таблице users если её нет
        await queryRunner.query(`
            ALTER TABLE users
                ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'user'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE users DROP COLUMN role`);
        await queryRunner.query(`DROP TYPE user_role`);
    }
}