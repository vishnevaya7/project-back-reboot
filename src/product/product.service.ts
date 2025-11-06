import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {CreateProductDto} from "./dto/create-product.dto";
import {UpdateProductDto} from "./dto/update-product.dto";

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
        return this.productRepository.find({
            relations: ['images'],
        });
    }

    async createProduct(createProductDto: CreateProductDto): Promise<Product> {
        const product = this.productRepository.create(createProductDto);
        return await this.productRepository.save(product);
    }

    async updateProduct(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
        const product = await this.productRepository.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        // Обновляем только переданные поля
        Object.assign(product, updateProductDto);
        
        return await this.productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<{ message: string }> {
        const product = await this.productRepository.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        await this.productRepository.remove(product);
        
        return { message: `Товар "${product.name}" успешно удален` };
    }
}
