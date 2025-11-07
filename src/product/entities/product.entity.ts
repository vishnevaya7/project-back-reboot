import {Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { ProductImage } from './product-image.entity';

@Entity('product')
export class Product {
    @ApiProperty({ description: 'Уникальный идентификатор товара', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ description: 'Название товара', example: 'iPhone 15' })
    @Column()
    name: string;

    @ApiProperty({ description: 'Описание товара', example: 'Новый iPhone с улучшенной камерой' })
    @Column()
    description: string;

    @ApiProperty({ description: 'Цена товара в рублях', example: 99999 })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({ description: 'Количество товара на складе', example: 10 })
    @Column({ type: 'integer' })
    count: number;

    @ApiProperty({ description: 'Дата создания товара', example: '2024-11-07T12:00:00.000Z' })
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ApiProperty({ description: 'Дата последнего обновления товара', example: '2024-11-07T12:00:00.000Z' })
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ApiProperty({
        description: 'Изображения товара',
        type: () => ProductImage,
        isArray: true,
        required: false
    })
    @OneToMany(() => ProductImage, 'product', { cascade: true })
    images?: ProductImage[];
}