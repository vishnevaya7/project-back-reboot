import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { CreateOrderDto } from '../../order/dto/create-order.dto';
import { CreateOrderResponseSchema, OrderListItemSchema } from '../schemas/order.schemas';
import { ApiAuth, ApiAuthResponses } from './common.decorators';

export const ApiCreateOrder = () => applyDecorators(
  ApiAuth(),
  ApiOperation({ summary: 'Создать новый заказ' }),
  ApiBody({ type: CreateOrderDto }),
  ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: CreateOrderResponseSchema
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' }),
  ApiAuthResponses()
);

export const ApiGetOrderById = () => applyDecorators(
  ApiOperation({ summary: 'Получить заказ по ID' }),
  ApiParam({ name: 'id', description: 'ID заказа', type: 'number', example: 1 }),
  ApiResponse({
    status: 200,
    description: 'Заказ найден',
    type: OrderListItemSchema
  }),
  ApiResponse({ status: 404, description: 'Заказ не найден' })
);

export const ApiGetAllOrders = () => applyDecorators(
  ApiOperation({ summary: 'Получить список всех заказов' }),
  ApiResponse({
    status: 200,
    description: 'Список заказов',
    type: [OrderListItemSchema]
  })
);
