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
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            schema: 'store',
            password: '0112',
            database: 'dev',
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
