import { ApiProperty } from '@nestjs/swagger';

export class ProductImageUploadBodySchema {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary'
    },
    description: 'Файлы изображений для загрузки'
  })
  files: any[];

  @ApiProperty({
    type: 'array',
    items: { type: 'string' },
    description: 'Альтернативные тексты для изображений (опционально)',
    required: false
  })
  altTexts?: string[];
}

export class ProductImageDeleteResponseSchema {
  @ApiProperty({ example: 'Изображение успешно удалено' })
  message: string;
}

export class ProductImageOrderUpdateBodySchema {
  @ApiProperty({
    example: 1,
    description: 'Новый порядок сортировки'
  })
  sortOrder: number;
}
