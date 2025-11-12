import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';

export class Page<T> {
    @ApiProperty({description: 'Содержимое страницы'})
    readonly content: T[];

    @ApiProperty({
        example: 100,
        description: 'Общее количество элементов',
        type: Number
    })
    @Type(() => Number)
    readonly total: number;

    @ApiProperty({
        example: 1,
        description: 'Текущая страница',
        type: Number
    })
    @Type(() => Number)
    readonly currentPage: number;

    @ApiProperty({
        example: 20,
        description: 'Размер страницы',
        type: Number
    })
    @Type(() => Number)
    readonly size: number;

    @ApiProperty({
        example: 5,
        description: 'Общее количество страниц',
        type: Number
    })
    @Type(() => Number)
    readonly totalPage: number;

    @ApiProperty({
        example: 'id',
        description: 'Поле сортировки',
        required: false
    })
    readonly sortBy?: string;

    @ApiProperty({
        example: 'ASC',
        description: 'Направление сортировки',
        enum: ['ASC', 'DESC']
    })
    readonly sortDirection: 'ASC' | 'DESC';

    constructor(
        content: T[],
        total: number,
        currentPage: number,
        size: number,
        sortBy?: string,
        sortDirection: 'ASC' | 'DESC' = 'ASC',
    ) {
        this.content = content;
        this.total = total;
        this.currentPage = currentPage;
        this.size = size;
        this.totalPage = Math.ceil(total / size);
        this.sortBy = sortBy;
        this.sortDirection = sortDirection;
    }

    @ApiProperty({
        example: true,
        description: 'Является ли текущая страница первой'
    })
    isFirst(): boolean {
        return this.currentPage === 1;
    }

    @ApiProperty({
        example: false,
        description: 'Является ли текущая страница последней'
    })
    isLast(): boolean {
        return this.currentPage === this.totalPage;
    }

    map<V>(fun: (item: T) => V): Page<V> {
        return new Page(
            this.content.map(fun),
            this.total,
            this.currentPage,
            this.size,
            this.sortBy,
            this.sortDirection
        );
    }
}