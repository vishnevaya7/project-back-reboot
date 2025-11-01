import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

import {Repository} from "typeorm";
import {Order} from "./entities/order.entity";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
    ) {}

    async getOrderById(id: number): Promise<Order | null> {
        return this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'productOrders.product']
        });
    }

    async getOrders(): Promise<Order[]> {
        return this.orderRepository.find({
            relations: ['user', 'productOrders.product']
        });
    }
}
