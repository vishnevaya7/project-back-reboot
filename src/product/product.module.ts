import {Product} from "./entities/product.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Module} from "@nestjs/common";
import {ProductService} from "./product.service";
import {ProductController} from "./product.controller";
import {Repository} from "typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([Product])],
    providers: [ProductService],
    controllers: [ProductController],
    exports: [ProductService]
})
export class ProductModule {}
