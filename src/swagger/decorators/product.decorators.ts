import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { Product } from '../../product/entities/product.entity';
import { CreateProductDto } from '../../product/dto/create-product.dto';
import { UpdateProductDto } from '../../product/dto/update-product.dto';
import { ApiAdminEndpoint, ApiCommonResponses } from './common.decorators';

export const ApiGetProduct = () => applyDecorators(
  ApiOperation({ summary: 'Получить товар по ID' }),
  ApiParam({ name: 'id', description: 'ID товара', type: 'number', example: 1 }),
  ApiResponse({
    status: 200,
    description: 'Товар найден',
    type: Product
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' }),
  ApiCommonResponses()
);

export const ApiGetProducts = () => applyDecorators(
  ApiOperation({ summary: 'Получить список всех товаров' }),
  ApiResponse({
    status: 200,
    description: 'Список товаров',
    type: [Product]
  }),
  ApiCommonResponses()
);

export const ApiCreateProduct = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Создать новый товар',
    description: 'Создание нового товара. Доступно только администраторам.'
  }),
  ApiBody({
    type: CreateProductDto,
    description: 'Данные для создания товара',
    examples: {
      example1: {
        summary: 'Пример создания товара',
        value: {
          name: 'iPhone 15',
          description: 'Новый iPhone с улучшенной камерой',
          price: 99999,
          count: 10
        }
      }
    }
  }),
  ApiResponse({
    status: 201,
    description: 'Товар успешно создан',
    type: Product
  })
);

export const ApiUpdateProduct = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Обновить товар',
    description: 'Частичное обновление товара. Можно обновить любые поля. Доступно только администраторам.'
  }),
  ApiParam({ name: 'id', description: 'ID товара для обновления', type: 'number', example: 1 }),
  ApiBody({
    type: UpdateProductDto,
    description: 'Данные для обновления товара (все поля опциональны)',
    examples: {
      updatePrice: {
        summary: 'Обновить только цену',
        value: {
          price: 109999
        }
      },
      updateNameAndDescription: {
        summary: 'Обновить название и описание',
        value: {
          name: 'iPhone 15 Pro',
          description: 'Обновленное описание товара'
        }
      },
      updateAll: {
        summary: 'Обновить все поля',
        value: {
          name: 'iPhone 15 Pro Max',
          description: 'Самый мощный iPhone',
          price: 129999,
          count: 5
        }
      }
    }
  }),
  ApiResponse({
    status: 200,
    description: 'Товар успешно обновлен',
    type: Product
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' })
);

export const ApiDeleteProduct = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Удалить товар',
    description: 'Полное удаление товара из системы. Доступно только администраторам.'
  }),
  ApiParam({ name: 'id', description: 'ID товара для удаления', type: 'number', example: 1 }),
  ApiResponse({
    status: 200,
    description: 'Товар успешно удален',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Товар "iPhone 15" успешно удален' }
      }
    }
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' })
);
