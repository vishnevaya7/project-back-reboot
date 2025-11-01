// app.module.ts
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';

import {UserModule} from './user/user.module';
import {AuthModule} from './auth/auth.module';
import {ProductModule} from "./product/product.module";
import {OrderModule} from "./order/order.module";

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'postgres',
            schema: process.env.DB_SCHEMA || 'store',
            password: process.env.DB_PASSWORD || '0112',
            database: process.env.DB_DATABASE || 'dev',
            autoLoadEntities: true,
            synchronize: false,
            logging: ['query', 'error', 'schema', 'warn', 'info', 'log']
        }),
        UserModule,
        AuthModule,
        ProductModule,
        OrderModule,
    ]
})
export class AppModule {
}
