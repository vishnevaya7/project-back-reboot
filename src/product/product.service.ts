import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {
    CreateProductRequest,
    UpdateProductRequest,
    ProductResponse,
    DeleteProductResponse
} from "../swagger/dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getProductById(id: number): Promise<ProductResponse | null> {
        const product = await this.productRepository.findOne({
            where: { id }
        });

        if (!product) {
            return null;
        }

        return this.transformProductToResponse(product);
    }

    async getProducts(): Promise<ProductResponse[]> {
        const products = await this.productRepository.find({
            relations: ['images'],
        });

        return products.map(product => this.transformProductToResponse(product));
    }

    async createProduct(createProductRequest: CreateProductRequest): Promise<ProductResponse> {
        const product = this.productRepository.create(createProductRequest);
        const savedProduct = await this.productRepository.save(product);
        return this.transformProductToResponse(savedProduct);
    }

    async updateProduct(id: number, updateProductRequest: UpdateProductRequest): Promise<ProductResponse> {
        const product = await this.productRepository.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        // Обновляем только переданные поля
        Object.assign(product, updateProductRequest);
        
        const updatedProduct = await this.productRepository.save(product);
        return this.transformProductToResponse(updatedProduct);
    }

    async deleteProduct(id: number): Promise<DeleteProductResponse> {
        const product = await this.productRepository.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        await this.productRepository.remove(product);
        
        return { message: `Товар "${product.name}" успешно удален` };
    }

    private transformProductToResponse(product: Product): ProductResponse {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            count: product.count,
            ...(product.createdAt && { createdAt: product.createdAt.toISOString() }),
            ...(product.updatedAt && { updatedAt: product.updatedAt.toISOString() })
        };
    }
}
