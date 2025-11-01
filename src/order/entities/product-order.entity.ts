import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Product } from '../../product/entities/product.entity';
import { Order } from './order.entity';

@Entity('product_order')
export class ProductOrder {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Order, order => order.productOrders)
    @JoinColumn({ name: 'order_id' })
    order: Order;

    @Column({ name: 'count', type: 'int' })
    count: number;
}
