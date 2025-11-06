import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { ProductImage } from '../../product/entities/product-image.entity';
import {
  ProductImageUploadBodySchema,
  ProductImageDeleteResponseSchema,
  ProductImageOrderUpdateBodySchema
} from '../schemas/product-image.schemas';
import { ApiAdminEndpoint, ApiCommonResponses } from './common.decorators';

export const ApiUploadProductImages = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Загрузить изображения для товара',
    description: 'Загрузка одного или нескольких изображений для товара. Доступно только администраторам.'
  }),
  ApiConsumes('multipart/form-data'),
  ApiBody({ type: ProductImageUploadBodySchema }),
  ApiResponse({
    status: 201,
    description: 'Изображения успешно загружены',
    type: [ProductImage]
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' })
);

export const ApiGetProductImages = () => applyDecorators(
  ApiOperation({ summary: 'Получить все изображения товара' }),
  ApiParam({ name: 'productId', description: 'ID товара', type: 'number' }),
  ApiResponse({
    status: 200,
    description: 'Список изображений товара',
    type: [ProductImage]
  }),
  ApiResponse({ status: 404, description: 'Товар не найден' }),
  ApiCommonResponses()
);

export const ApiDeleteProductImage = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Удалить изображение',
    description: 'Удаление изображения товара. Доступно только администраторам.'
  }),
  ApiParam({ name: 'imageId', description: 'ID изображения', type: 'number' }),
  ApiResponse({
    status: 200,
    description: 'Изображение успешно удалено',
    type: ProductImageDeleteResponseSchema
  }),
  ApiResponse({ status: 404, description: 'Изображение не найдено' })
);

export const ApiSetMainProductImage = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Установить главное изображение',
    description: 'Устанавливает изображение как главное для товара. Доступно только администраторам.'
  }),
  ApiParam({ name: 'imageId', description: 'ID изображения', type: 'number' }),
  ApiResponse({
    status: 200,
    description: 'Главное изображение успешно установлено',
    type: ProductImage
  }),
  ApiResponse({ status: 404, description: 'Изображение не найдено' })
);

export const ApiUpdateProductImageOrder = () => applyDecorators(
  ApiAdminEndpoint(),
  ApiOperation({
    summary: 'Изменить порядок изображения',
    description: 'Изменяет порядок отображения изображения. Доступно только администраторам.'
  }),
  ApiParam({ name: 'imageId', description: 'ID изображения', type: 'number' }),
  ApiBody({ type: ProductImageOrderUpdateBodySchema }),
  ApiResponse({
    status: 200,
    description: 'Порядок изображения успешно изменен',
    type: ProductImage
  }),
  ApiResponse({ status: 404, description: 'Изображение не найдено' })
);
