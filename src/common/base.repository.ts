
import {FindOptionsOrder, ObjectLiteral, Repository} from 'typeorm';
import { Page } from '../swagger/dto/page';
import { Pageable } from '../swagger/dto/pageable';

export abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
    async getPage(pageable: Pageable, whereCondition: any = {}): Promise<Page<T>> {

        let sortBy: string = 'id';
        let sortDirection: 'ASC' | 'DESC' = 'ASC';
        if (pageable.sort) {
            const [field, direction] = pageable.sort.split(',');
            sortBy = field || 'id';
            sortDirection = (direction?.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        }

        const total = await this.count({ where: whereCondition });

        const items = await this.find({
            where: whereCondition,
            skip: (pageable.page - 1) * pageable.size,
            take: pageable.size,
            order: { [sortBy]: sortDirection } as FindOptionsOrder<T>,
            relations:[]
        });

        return new Page<T>(
            items,
            total,
            pageable.page,
            pageable.size,
            sortBy,
            sortDirection,
        );
    }
}