import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {OrderService} from "./order.service";
import {OrderController} from "./order.controller";
import {ProductOrder} from "./entities/product-order.entity";
import {Product} from "../product/entities/product.entity";


@Module({
    imports: [TypeOrmModule.forFeature([Order, ProductOrder, Product])],
    providers: [OrderService],
    controllers: [OrderController],
    exports: [OrderService]
})
export class OrderModule {}
