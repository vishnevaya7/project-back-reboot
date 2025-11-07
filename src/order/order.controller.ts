import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  OrderResponse, 
  OrderListResponse 
} from "../swagger/dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { 
  ApiCreateOrder, 
  ApiGetOrderById, 
  ApiGetAllOrders 
} from '../swagger';

@ApiTags('Заказы')
@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiCreateOrder()
    async create(@Body() createOrderRequest: CreateOrderRequest, @Request() req): Promise<CreateOrderResponse> {
        return this.orderService.createOrder(createOrderRequest, req.user.id);
    }

    @Get(':id')
    @ApiGetOrderById()
    async findOne(@Param('id') id: number): Promise<OrderResponse | null> {
        return this.orderService.getOrderById(id);
    }

    @Get()
    @ApiGetAllOrders()
    async findAll(): Promise<OrderListResponse> {
        return this.orderService.getOrders();
    }
}