import { ProductService } from "./product.service";
import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { Product } from "./entities/product.entity";

@ApiTags('Товары')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить товар по ID' })
    @ApiParam({ name: 'id', description: 'ID товара', type: 'number', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Товар найден',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'iPhone 15' },
                description: { type: 'string', example: 'Новый iPhone с улучшенной камерой' },
                price: { type: 'number', example: 99999 },
                count: { type: 'number', example: 10 }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Товар не найден' })
    async findOne(@Param('id') id: number): Promise<Product | null> {
        return this.productService.getProductById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список всех товаров' })
    @ApiResponse({
        status: 200,
        description: 'Список товаров',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    name: { type: 'string', example: 'iPhone 15' },
                    description: { type: 'string', example: 'Новый iPhone с улучшенной камерой' },
                    price: { type: 'number', example: 99999 },
                    count: { type: 'number', example: 10 }
                }
            }
        }
    })
    async findAll(): Promise<Product[]> {
        return this.productService.getProducts();
    }
}