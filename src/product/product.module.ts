import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { ProductImageController } from './product-image.controller';
import { ProductService } from './product.service';
import { ProductImageService } from './product-image.service';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductImage])
    ],
    controllers: [ProductController, ProductImageController],
    providers: [ProductService, ProductImageService],
    exports: [ProductService, ProductImageService]
})
export class ProductModule {}
