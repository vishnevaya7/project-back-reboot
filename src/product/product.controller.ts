import { ProductService } from "./product.service";
import {Body, Controller, Delete, Get, Param, Patch, Post, UseGuards} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { 
    CreateProductRequest, 
    UpdateProductRequest, 
    ProductResponse,
    DeleteProductResponse 
} from "../swagger/dto";
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
    async findOne(@Param('id') id: number): Promise<ProductResponse | null> {
        return this.productService.getProductById(id);
    }

    @Get()
    @ApiGetProducts()
    async findAll(): Promise<ProductResponse[]> {
        return this.productService.getProducts();
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiCreateProduct()
    async createProduct(@Body() createProductRequest: CreateProductRequest): Promise<ProductResponse> {
        return this.productService.createProduct(createProductRequest);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiUpdateProduct()
    async updateProduct(
        @Param('id') id: number,
        @Body() updateProductRequest: UpdateProductRequest
    ): Promise<ProductResponse> {
        return this.productService.updateProduct(id, updateProductRequest);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiDeleteProduct()
    async deleteProduct(@Param('id') id: number): Promise<DeleteProductResponse> {
        return this.productService.deleteProduct(id);
    }
}