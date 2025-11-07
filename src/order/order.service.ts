import {Injectable, NotFoundException, BadRequestException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";

import {Repository} from "typeorm";
import {Order, OrderStatus, PaymentStatus} from "./entities/order.entity";
import {ProductOrder} from "./entities/product-order.entity";
import {Product} from "../product/entities/product.entity";
import {
    CreateOrderRequest,
    CreateOrderResponse,
    OrderResponse,
    OrderListResponse,
    OrderItemResponse
} from "../swagger/dto";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(ProductOrder)
        private readonly productOrderRepository: Repository<ProductOrder>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getOrderById(id: number): Promise<OrderResponse> {
        const order = await this.orderRepository.findOne({
            where: { id },
            relations: ['user', 'productOrders.product']
        });

        if (!order) {
            throw new NotFoundException(`Заказ с ID ${id} не найден`);
        }

        return this.transformOrderToResponse(order);
    }

    async getOrders(): Promise<OrderListResponse> {
        const orders = await this.orderRepository.find({
            relations: ['user', 'productOrders.product']
        });

        return {
            orders: orders.map(order => ({
                id: order.id,
                orderNumber: order.orderNumber,
                totalAmount: order.totalAmount,
                status: order.status,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt.toISOString()
            }))
        };
    }

    async createOrder(createOrderRequest: CreateOrderRequest, userId: number): Promise<CreateOrderResponse> {
        const { items, shippingAddress, paymentMethod, comment } = createOrderRequest;

        // Проверяем существование всех товаров и их наличие
        const productIds = items.map(item => item.productId);
        const products = await this.productRepository.findByIds(productIds);

        if (products.length !== productIds.length) {
            throw new NotFoundException('Один или несколько товаров не найдены');
        }

        // Проверяем наличие товаров на складе
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
            }
            if (product.count < item.count) {
                throw new BadRequestException(`Недостаточно товара "${product.name}" на складе. Доступно: ${product.count}, запрошено: ${item.count}`);
            }
        }

        // Вычисляем общую сумму заказа
        let totalAmount = 0;
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
            }
            totalAmount += product.price * item.count;
        }

        // Генерируем уникальный номер заказа
        const orderNumber = await this.generateOrderNumber();

        // Создаем заказ
        const order = this.orderRepository.create({
            userId,
            shippingAddress,
            paymentMethod,
            comment,
            totalAmount,
            orderNumber,
            status: OrderStatus.PENDING,
            paymentStatus: PaymentStatus.PENDING
        });

        const savedOrder = await this.orderRepository.save(order);

        // Создаем связи товар-заказ
        const productOrders = items.map(item => {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
            }
            return this.productOrderRepository.create({
                order: savedOrder,
                product: product,
                count: item.count
            });
        });

        await this.productOrderRepository.save(productOrders);

        // Обновляем количество товаров на складе
        for (const item of items) {
            const product = products.find(p => p.id === item.productId);
            if (!product) {
                throw new NotFoundException(`Товар с ID ${item.productId} не найден`);
            }
            product.count -= item.count;
            await this.productRepository.save(product);
        }

        // Получаем полную информацию о заказе
        const fullOrder = await this.orderRepository.findOne({
            where: { id: savedOrder.id },
            relations: ['user', 'productOrders.product']
        });

        if (!fullOrder) {
            throw new NotFoundException('Ошибка при создании заказа');
        }

        return {
            message: 'Заказ успешно создан',
            order: this.transformOrderToResponse(fullOrder)
        };
    }

    private transformOrderToResponse(order: Order): OrderResponse {
        const items: OrderItemResponse[] = order.productOrders?.map(po => ({
            productId: po.product.id,
            productName: po.product.name,
            count: po.count,
            unitPrice: po.product.price,
            totalPrice: po.product.price * po.count
        })) || [];

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            userId: order.userId,
            items,
            totalAmount: order.totalAmount,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            comment: order.comment,
            status: order.status,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt.toISOString(),
            updatedAt: order.createdAt.toISOString() // Пока используем createdAt
        };
    }

    private async generateOrderNumber(): Promise<string> {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        // Получаем количество заказов за сегодня
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        const todayOrdersCount = await this.orderRepository.count({
            where: {
                createdAt: {
                    gte: startOfDay,
                    lt: endOfDay
                } as any
            }
        });

        const orderSequence = String(todayOrdersCount + 1).padStart(3, '0');
        return `ORD-${year}${month}${day}-${orderSequence}`;
    }
}
