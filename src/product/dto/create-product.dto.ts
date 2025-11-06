import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
    @ApiProperty({
        description: 'Название товара',
        example: 'iPhone 15',
        minLength: 1,
        maxLength: 255
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Описание товара',
        example: 'Новый iPhone с улучшенной камерой',
        maxLength: 1000
    })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({
        description: 'Цена товара в рублях',
        example: 99999,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({
        description: 'Количество товара на складе',
        example: 10,
        minimum: 0
    })
    @IsNumber()
    @IsPositive()
    count: number;
}
