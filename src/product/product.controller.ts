import { ProductService } from "./product.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "../user/entities/user.entity";
import {
    ApiGetProduct,
    ApiGetProducts,
    ApiCreateProduct,
    ApiUpdateProduct,
    ApiDeleteProduct
} from '../swagger';

@ApiTags('Товары')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Get(':id')
    @ApiGetProduct()
    async findOne(@Param('id') id: number): Promise<Product | null> {
        return this.productService.getProductById(id);
    }

    @Get()
    @ApiGetProducts()
    async findAll(): Promise<Product[]> {
        return this.productService.getProducts();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiCreateProduct()
    async createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
        return this.productService.createProduct(createProductDto);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiUpdateProduct()
    async updateProduct(
        @Param('id') id: number,
        @Body() updateProductDto: UpdateProductDto
    ): Promise<Product> {
        return this.productService.updateProduct(id, updateProductDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiDeleteProduct()
    async deleteProduct(@Param('id') id: number): Promise<{ message: string }> {
        return this.productService.deleteProduct(id);
    }
}