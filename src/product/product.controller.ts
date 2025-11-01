import {ProductService} from "./product.service";
import {Controller, Get, Param} from "@nestjs/common";
import {Product} from "./entities/product.entity";

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Product | null> {
        return this.productService.getProductById(id);
    }

    @Get()
    async findAll(): Promise<Product[]> {
        return this.productService.getProducts();
    }
}