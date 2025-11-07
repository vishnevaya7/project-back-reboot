import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsNotEmpty } from 'class-validator';

// Request DTOs
export class CreateProductRequest {
  @ApiProperty({
    example: 'iPhone 15',
    description: 'Название товара'
  })
  @IsString()
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  name: string;

  @ApiProperty({
    example: 'Новый iPhone с улучшенной камерой и процессором',
    description: 'Описание товара'
  })
  @IsString()
  @IsNotEmpty({ message: 'Описание товара не может быть пустым' })
  description: string;

  @ApiProperty({
    example: 99999,
    description: 'Цена товара в копейках'
  })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @ApiProperty({
    example: 10,
    description: 'Количество товара на складе'
  })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  count: number;
}

export class UpdateProductRequest {
  @ApiProperty({
    example: 'iPhone 15 Pro',
    description: 'Название товара',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Название товара не может быть пустым' })
  name?: string;

  @ApiProperty({
    example: 'Обновленное описание товара',
    description: 'Описание товара',
    required: false
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'Описание товара не может быть пустым' })
  description?: string;

  @ApiProperty({
    example: 109999,
    description: 'Цена товара в копейках',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price?: number;

  @ApiProperty({
    example: 5,
    description: 'Количество товара на складе',
    required: false
  })
  @IsOptional()
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(0, { message: 'Количество не может быть отрицательным' })
  count?: number;
}

// Response DTOs
export class ProductResponse {
    @ApiProperty({ example: 1, description: 'ID товара' })
    id: number;

    @ApiProperty({ example: 'iPhone 15', description: 'Название товара' })
    name: string;

    @ApiProperty({ example: 'Новый iPhone с улучшенной камерой', description: 'Описание товара' })
    description: string;

    @ApiProperty({ example: 99999, description: 'Цена товара в копейках' })
    price: number;

    @ApiProperty({ example: 10, description: 'Количество товара на складе' })
    count: number;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Дата создания товара',
        required: false
    })
    createdAt?: string;

    @ApiProperty({
        example: '2024-01-01T00:00:00.000Z',
        description: 'Дата последнего обновления товара',
        required: false
    })
    updatedAt?: string;
}

export class ProductListResponse {
  @ApiProperty({
    type: [ProductResponse],
    description: 'Список товаров'
  })
  products: ProductResponse[];
}

export class DeleteProductResponse {
  @ApiProperty({
    example: 'Товар "iPhone 15" успешно удален',
    description: 'Сообщение о статусе удаления'
  })
  message: string;
}

export class ProductNotFoundResponse {
  @ApiProperty({
    example: 'Товар не найден',
    description: 'Сообщение об ошибке'
  })
  message: string;

  @ApiProperty({
    example: 404,
    description: 'Код ошибки'
  })
  statusCode: number;
}

export class CreateProductResponse {
  @ApiProperty({
    type: ProductResponse,
    description: 'Созданный товар'
  })
  product: ProductResponse;
}

export class UpdateProductResponse {
  @ApiProperty({
    type: ProductResponse,
    description: 'Обновленный товар'
  })
  product: ProductResponse;
}
