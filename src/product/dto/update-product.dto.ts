import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class UpdateProductDto {
    @ApiProperty({
        description: 'Название товара',
        example: 'iPhone 15 Pro',
        required: false
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Описание товара',
        example: 'Обновленное описание товара',
        required: false
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({
        description: 'Цена товара в рублях',
        example: 109999,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    price?: number;

    @ApiProperty({
        description: 'Количество товара на складе',
        example: 5,
        required: false
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    count?: number;
}
