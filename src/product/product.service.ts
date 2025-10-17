import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getProductById(id: number): Promise<Product | null> {
        return this.productRepository.findOne({
            where: { id }
        });
    }

    async getProducts(): Promise<Product[]> {
        return this.productRepository.find();
    }
}
