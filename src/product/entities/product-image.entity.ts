import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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

    // Связь с товаром (используем строковую ссылку для избежания циклической зависимости)
    @ManyToOne('Product', 'images', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'productId' })
    product: any;
}
