import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    OneToMany,
    JoinColumn,
    ManyToMany
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from "../../user/entities/user.entity";
import { Product } from "../../product/entities/product.entity";
import { ProductOrder } from "./product-order.entity";

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled'
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
    REFUNDED = 'refunded'
}

@Entity('order')
export class Order {
    @ApiProperty({ description: 'Уникальный идентификатор заказа', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    // table product_order(productId, orderId, count)
    @ApiProperty({ description: 'Товары в заказе', type: () => [ProductOrder] })
    @OneToMany(() => ProductOrder, productOrder => productOrder.order)
    productOrders: ProductOrder[];

    // Связь с User
    @ApiProperty({ description: 'Пользователь, создавший заказ', type: () => User })
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ApiProperty({ description: 'ID пользователя', example: 1 })
    @Column({ name: 'user_id' })
    userId: number;

    @ApiProperty({ description: 'Комментарий к заказу', example: 'Доставить до 18:00', required: false })
    @Column({ name: 'comment', nullable: true })
    comment: string;

    @ApiProperty({ 
        description: 'Статус заказа', 
        enum: OrderStatus, 
        example: OrderStatus.PENDING 
    })
    @Column({
        name: 'status',
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @ApiProperty({ description: 'Дата создания заказа', example: '2024-01-01T12:00:00Z' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'Общая сумма заказа', example: 199998.50 })
    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @ApiProperty({ description: 'Адрес доставки', example: 'г. Москва, ул. Ленина, д. 1, кв. 1' })
    @Column({ name: 'shipping_address' })
    shippingAddress: string;

    @ApiProperty({ description: 'Номер заказа', example: 'ORD-2024-001' })
    @Column({ name: 'order_number', unique: true })
    orderNumber: string;

    @ApiProperty({ description: 'Способ оплаты', example: 'card' })
    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @ApiProperty({ 
        description: 'Статус оплаты', 
        enum: PaymentStatus, 
        example: PaymentStatus.PENDING 
    })
    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    paymentStatus: PaymentStatus;
}