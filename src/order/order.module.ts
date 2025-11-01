import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {ProductOrder} from "./entities/product-order.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Order, ProductOrder])],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule {}
