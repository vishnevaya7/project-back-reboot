import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
    @ApiProperty({ description: 'ID товара', example: 1 })
    @IsNumber({}, { message: 'ID товара должен быть числом' })
    @Min(1, { message: 'ID товара должен быть больше 0' })
    productId: number;

    @ApiProperty({ description: 'Количество товара', example: 2 })
    @IsNumber({}, { message: 'Количество должно быть числом' })
    @Min(1, { message: 'Количество должно быть больше 0' })
    count: number;
}

export class CreateOrderDto {
    @ApiProperty({
        description: 'Товары в заказе',
        type: [OrderItemDto],
        example: [
            { productId: 1, count: 2 },
            { productId: 3, count: 1 }
        ]
    })
    @IsArray({ message: 'Товары должны быть массивом' })
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ description: 'Адрес доставки', example: 'г. Москва, ул. Ленина, д. 1, кв. 1' })
    @IsString({ message: 'Адрес доставки должен быть строкой' })
    @IsNotEmpty({ message: 'Адрес доставки не может быть пустым' })
    shippingAddress: string;

    @ApiProperty({ description: 'Способ оплаты', example: 'card', enum: ['card', 'cash', 'online'] })
    @IsString({ message: 'Способ оплаты должен быть строкой' })
    @IsNotEmpty({ message: 'Способ оплаты не может быть пустым' })
    @IsEnum(['card', 'cash', 'online'], { message: 'Недопустимый способ оплаты' })
    paymentMethod: string;

    @ApiProperty({ description: 'Комментарий к заказу', example: 'Доставить до 18:00', required: false })
    @IsOptional()
    @IsString({ message: 'Комментарий должен быть строкой' })
    comment?: string;
}
