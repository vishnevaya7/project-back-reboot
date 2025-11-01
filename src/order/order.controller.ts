
import {Controller, Get, Param} from "@nestjs/common";
import {OrderService} from "./order.service";
import {Order} from "./entities/order.entity";


@Controller('order')
export class OrderController {
    constructor(private readonly orderService: OrderService) {
    }

    @Get(':id')
    async findOne(@Param('id') id: number): Promise<Order | null> {
        return this.orderService.getOrderById(id);
    }

    @Get()
    async findAll(): Promise<Order[]> {
        return this.orderService.getOrders();
    }
}