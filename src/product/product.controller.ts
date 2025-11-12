import {Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import {
    CreateProductRequest,
    UpdateProductRequest,
    ProductDetailResponse,
    ProductListItemResponse,
    DeleteProductResponse, GetProductPredicate, GetUserPredicate
} from "../swagger/dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "../user/entities/user.entity";
import {ProductService} from "./product.service";
import {
    ApiCreateProduct,
    ApiDeleteProduct,
    ApiGetProduct,
    ApiGetProducts,
    ApiUpdateProduct
} from "../swagger/decorators/product.decorators";
import {Page} from "../swagger/dto/page";
import {Pageable} from "../swagger/dto/pageable";

@ApiTags('products')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Get(':id')
    @ApiGetProduct()
    async findOne(@Param('id') id: number): Promise<ProductDetailResponse | null> {
        return this.productService.getProductById(id);
    }

    @Get()
    @ApiGetProducts()
    async findAll(@Query() req: Pageable & GetProductPredicate): Promise<Page<ProductListItemResponse>> {

        const pageable: Pageable = {
            page: req.page ? Number(req.page) : 1,
            size: req.size ? Number(req.size) : 10,
            sort: req.sort
        };

        // Функция для преобразования строки или массива строк в массив чисел
        const toNumberArray = (value: any): number[] | undefined => {
            if (!value) return undefined;
            const array = Array.isArray(value) ? value : [value];
            return array.map(v => Number(v));
        };

        // Функция для преобразования строки или массива строк в массив строк
        const toStringArray = (value: any): string[] | undefined => {
            if (!value) return undefined;
            const array = Array.isArray(value) ? value : [value];
            return array.map(v => v.toString().trim());
        };

        const predicate: GetProductPredicate = {
            ids: toNumberArray(req.ids),
            name: toStringArray(req.name),
            nameLike: req.nameLike ? req.nameLike.trim() : undefined,
            description: toStringArray(req.description),
            descriptionContains: req.descriptionContains ? req.descriptionContains.trim() : undefined,
            priceFrom: req.priceFrom ? Number(req.priceFrom) : undefined,
            priceTo: req.priceTo ? Number(req.priceTo) : undefined,
            count: toNumberArray(req.count),
            countFrom: req.countFrom ? Number(req.countFrom) : undefined,
            countTo: req.countTo ? Number(req.countTo) : undefined,
            createdFrom: req.createdFrom ? new Date(req.createdFrom) : undefined,
            createdTo: req.createdTo ? new Date(req.createdTo) : undefined,
            updatedFrom: req.updatedFrom ? new Date(req.updatedFrom) : undefined,
            updatedTo: req.updatedTo ? new Date(req.updatedTo) : undefined
        }
        return this.productService.getProducts(pageable, predicate);
    }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiCreateProduct()
    async createProduct(@Body() createProductRequest: CreateProductRequest): Promise<ProductDetailResponse> {
        return this.productService.createProduct(createProductRequest);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiUpdateProduct()
    async updateProduct(
        @Param('id') id: number,
        @Body() updateProductRequest: UpdateProductRequest
    ): Promise<ProductDetailResponse> {
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