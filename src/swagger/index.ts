// Основная конфигурация
export { SwaggerConfig } from './swagger.config';

// Централизованные DTO
export * from './dto';

// Базовые декораторы
export * from './decorators/common.decorators';

// Специализированные декораторы по модулям
export * from './decorators/auth.decorators';
export * from './decorators/order.decorators';
export * from './decorators/product.decorators';
export * from './decorators/product-image.decorators';

// Схемы ответов (устаревшие, используйте DTO)
export * from './schemas/auth.schemas';
export * from './schemas/order.schemas';
export * from './schemas/product-image.schemas';
