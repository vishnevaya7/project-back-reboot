import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { Order } from "./entities/order.entity";

@ApiTags('Заказы')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить заказ по ID' })
    @ApiParam({ name: 'id', description: 'ID заказа', type: 'number', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'Заказ найден',
        schema: {
            type: 'object',
            properties: {
                id: { type: 'number', example: 1 },
                userId: { type: 'number', example: 1 },
                totalAmount: { type: 'number', example: 199998 },
                status: { type: 'string', example: 'pending' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' }
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Заказ не найден' })
    async findOne(@Param('id') id: number): Promise<Order | null> {
        return this.orderService.getOrderById(id);
    }

    @Get()
    @ApiOperation({ summary: 'Получить список всех заказов' })
    @ApiResponse({
        status: 200,
        description: 'Список заказов',
        schema: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'number', example: 1 },
                    userId: { type: 'number', example: 1 },
                    totalAmount: { type: 'number', example: 199998 },
                    status: { type: 'string', example: 'pending' },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    })
    async findAll(): Promise<Order[]> {
        return this.orderService.getOrders();
    }
}