import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class Pageable {
    @ApiPropertyOptional({
        description: 'Номер страницы (начиная с 1)',
        default: 1,
        minimum: 1
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page: number = 1;

    @ApiPropertyOptional({
        description: 'Количество элементов на странице',
        default: 10,
        minimum: 1,
        maximum: 100
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    size: number = 10;

    @ApiPropertyOptional({
        description: 'Параметр сортировки в формате "поле,направление" (например: "id,DESC")',
        example: 'id,ASC'
    })
    @IsOptional()
    @IsString()
    sort?: string;
}

//TODO создать класс, который наследуется от Repository и внедрить class Pageable и WhereCondition,