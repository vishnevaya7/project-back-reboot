import { Controller, Get, Post, Body, Param, UseGuards, Request } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { Order } from "./entities/order.entity";
import { CreateOrderDto } from "./dto/create-order.dto";
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
    async create(@Body() createOrderDto: CreateOrderDto, @Request() req): Promise<Order> {
        return this.orderService.createOrder(createOrderDto, req.user.id);
    }

    @Get(':id')
    @ApiGetOrderById()
    async findOne(@Param('id') id: number): Promise<Order | null> {
        return this.orderService.getOrderById(id);
    }

    @Get()
    @ApiGetAllOrders()
    async findAll(): Promise<Order[]> {
        return this.orderService.getOrders();
    }
}