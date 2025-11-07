import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, Min, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

// Request DTOs
export class OrderItemRequest {
  @ApiProperty({
    description: 'ID товара',
    example: 1
  })
  @IsNumber({}, { message: 'ID товара должен быть числом' })
  @Min(1, { message: 'ID товара должен быть больше 0' })
  productId: number;

  @ApiProperty({
    description: 'Количество товара',
    example: 2
  })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(1, { message: 'Количество должно быть больше 0' })
  count: number;
}

export class CreateOrderRequest {
  @ApiProperty({
    description: 'Товары в заказе',
    type: [OrderItemRequest],
    example: [
      { productId: 1, count: 2 },
      { productId: 3, count: 1 }
    ]
  })
  @IsArray({ message: 'Товары должны быть массивом' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemRequest)
  items: OrderItemRequest[];

  @ApiProperty({
    description: 'Адрес доставки',
    example: 'г. Москва, ул. Ленина, д. 1, кв. 1'
  })
  @IsString({ message: 'Адрес доставки должен быть строкой' })
  @IsNotEmpty({ message: 'Адрес доставки не может быть пустым' })
  shippingAddress: string;

  @ApiProperty({
    description: 'Способ оплаты',
    example: 'card',
    enum: ['card', 'cash', 'online']
  })
  @IsString({ message: 'Способ оплаты должен быть строкой' })
  @IsNotEmpty({ message: 'Способ оплаты не может быть пустым' })
  @IsEnum(['card', 'cash', 'online'], { message: 'Недопустимый способ оплаты' })
  paymentMethod: string;

  @ApiProperty({
    description: 'Комментарий к заказу',
    example: 'Доставить до 18:00',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Комментарий должен быть строкой' })
  comment?: string;
}

// Response DTOs
export class OrderItemResponse {
  @ApiProperty({ example: 1, description: 'ID товара' })
  productId: number;

  @ApiProperty({ example: 'iPhone 15', description: 'Название товара' })
  productName: string;

  @ApiProperty({ example: 2, description: 'Количество товара в заказе' })
  count: number;

  @ApiProperty({ example: 99999, description: 'Цена за единицу товара' })
  unitPrice: number;

  @ApiProperty({ example: 199998, description: 'Общая стоимость позиции' })
  totalPrice: number;
}

export class OrderResponse {
  @ApiProperty({ example: 1, description: 'ID заказа' })
  id: number;

  @ApiProperty({ example: 'ORD-20241107-001', description: 'Номер заказа' })
  orderNumber: string;

  @ApiProperty({ example: 1, description: 'ID пользователя' })
  userId: number;

  @ApiProperty({
    type: [OrderItemResponse],
    description: 'Товары в заказе'
  })
  items: OrderItemResponse[];

  @ApiProperty({ example: 199998, description: 'Общая сумма заказа' })
  totalAmount: number;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1, кв. 1', description: 'Адрес доставки' })
  shippingAddress: string;

  @ApiProperty({ example: 'card', description: 'Способ оплаты' })
  paymentMethod: string;

  @ApiProperty({ example: 'Доставить до 18:00', description: 'Комментарий к заказу' })
  comment?: string;

  @ApiProperty({ example: 'PENDING', description: 'Статус заказа' })
  status: string;

  @ApiProperty({ example: 'PENDING', description: 'Статус оплаты' })
  paymentStatus: string;

  @ApiProperty({ example: '2024-11-07T12:00:00.000Z', description: 'Дата создания заказа' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-07T12:00:00.000Z', description: 'Дата последнего обновления заказа' })
  updatedAt: string;
}

export class OrderListItem {
  @ApiProperty({ example: 1, description: 'ID заказа' })
  id: number;

  @ApiProperty({ example: 'ORD-20241107-001', description: 'Номер заказа' })
  orderNumber: string;

  @ApiProperty({ example: 199998, description: 'Общая сумма заказа' })
  totalAmount: number;

  @ApiProperty({ example: 'PENDING', description: 'Статус заказа' })
  status: string;

  @ApiProperty({ example: 'PENDING', description: 'Статус оплаты' })
  paymentStatus: string;

  @ApiProperty({ example: '2024-11-07T12:00:00.000Z', description: 'Дата создания заказа' })
  createdAt: string;
}

export class OrderListResponse {
  @ApiProperty({
    type: [OrderListItem],
    description: 'Список заказов'
  })
  orders: OrderListItem[];
}

export class CreateOrderResponse {
  @ApiProperty({
    example: 'Заказ успешно создан',
    description: 'Сообщение о статусе создания заказа'
  })
  message: string;

  @ApiProperty({
    type: OrderResponse,
    description: 'Созданный заказ'
  })
  order: OrderResponse;
}

export class OrderNotFoundResponse {
  @ApiProperty({
    example: 'Заказ не найден',
    description: 'Сообщение об ошибке'
  })
  message: string;

  @ApiProperty({
    example: 404,
    description: 'Код ошибки'
  })
  statusCode: number;
}
