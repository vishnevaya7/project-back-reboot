import { ApiProperty } from '@nestjs/swagger';

export class OrderProductSchema {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  count: number;

  @ApiProperty({
    example: {
      id: 1,
      name: 'iPhone 15',
      price: 99999
    }
  })
  product: object;
}

export class CreateOrderResponseSchema {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 199998 })
  totalAmount: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: 'pending' })
  paymentStatus: string;

  @ApiProperty({ example: 'ORD-20241106-001' })
  orderNumber: string;

  @ApiProperty({ example: 'г. Москва, ул. Ленина, д. 1, кв. 1' })
  shippingAddress: string;

  @ApiProperty({ example: 'card' })
  paymentMethod: string;

  @ApiProperty({ example: 'Доставить до 18:00', required: false })
  comment?: string;

  @ApiProperty({ example: '2024-11-06T16:48:51.000Z' })
  createdAt: string;

  @ApiProperty({ type: [OrderProductSchema] })
  productOrders: OrderProductSchema[];
}

export class OrderListItemSchema {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 199998 })
  totalAmount: number;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: '2024-11-06T16:48:51.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2024-11-06T16:48:51.000Z' })
  updatedAt: string;
}
