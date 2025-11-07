import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from './product.entity';

@Entity('product_image')
export class ProductImage {
    @ApiProperty({ description: 'Уникальный идентификатор изображения', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'ID товара', example: 1 })
    @Column()
    productId: number;

    @ApiProperty({ description: 'URL изображения', example: '/uploads/products/image1.jpg' })
    @Column()
    imageUrl: string;

    @ApiProperty({ description: 'Альтернативный текст для изображения', example: 'iPhone 15 вид спереди', required: false })
    @Column({ nullable: true })
    altText?: string;

    @ApiProperty({ description: 'Порядок отображения изображения', example: 1 })
    @Column({ default: 0 })
    sortOrder: number;

    @ApiProperty({ description: 'Главное изображение товара', example: true })
    @Column({ default: false })
    isMain: boolean;

    @ApiProperty({ description: 'Дата создания записи' })
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    // Связь с товаром
    @ManyToOne(() => Product, product => product.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: Product;
}
