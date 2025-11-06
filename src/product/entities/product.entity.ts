import {Entity, Column, PrimaryGeneratedColumn, OneToMany} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

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
    @Column()
    price: number;

    @ApiProperty({ description: 'Количество товара на складе', example: 10 })
    @Column()
    count: number;

    @ApiProperty({
        description: 'Изображения товара',
        type: () => 'ProductImage',
        isArray: true,
        required: false
    })
    @OneToMany('ProductImage', 'product', { cascade: true })
    images?: any[];
}