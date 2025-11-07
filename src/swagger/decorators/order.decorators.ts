import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { 
  CreateOrderRequest, 
  CreateOrderResponse, 
  OrderResponse, 
  OrderListResponse,
  OrderNotFoundResponse
} from '../dto/order.dto';
import { ApiAuth, ApiAuthResponses } from './common.decorators';

export const ApiCreateOrder = () => applyDecorators(
  ApiAuth(),
  ApiOperation({ summary: 'Создать новый заказ' }),
  ApiBody({ type: CreateOrderRequest }),
  ApiResponse({
    status: 201,
    description: 'Заказ успешно создан',
    type: CreateOrderResponse
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
    type: OrderResponse
  }),
  ApiResponse({ 
    status: 404, 
    description: 'Заказ не найден',
    type: OrderNotFoundResponse
  })
);

export const ApiGetAllOrders = () => applyDecorators(
  ApiOperation({ summary: 'Получить список всех заказов' }),
  ApiResponse({
    status: 200,
    description: 'Список заказов',
    type: OrderListResponse
  })
);
