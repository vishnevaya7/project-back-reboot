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
import {User} from "../../user/entities/user.entity";
import {Product} from "../../product/entities/product.entity";
import {ProductOrder} from "./product-order.entity";


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
    @PrimaryGeneratedColumn()
    id: number;

// table product_order(productId, orderId, count)
    @OneToMany(() => ProductOrder, productOrder => productOrder.order)
    productOrders: ProductOrder[];
    // Связь с User
    @ManyToOne(() => User, user => user.orders)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: number;

    @Column({ name: 'comment', nullable: true })
    comment: string;

    @Column({
        name: 'status',
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    status: OrderStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Column({ name: 'total_amount', type: 'decimal', precision: 10, scale: 2 })
    totalAmount: number;

    @Column({ name: 'shipping_address' })
    shippingAddress: string;

    @Column({ name: 'order_number', unique: true })
    orderNumber: string;

    @Column({ name: 'payment_method' })
    paymentMethod: string;

    @Column({
        name: 'payment_status',
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    paymentStatus: PaymentStatus;
}