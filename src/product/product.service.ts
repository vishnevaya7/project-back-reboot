import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {
    CreateProductRequest,
    UpdateProductRequest,
    ProductDetailResponse,
    ProductListItemResponse,
    DeleteProductResponse
} from "../swagger/dto";

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>,
    ) {}

    async getProductById(id: number): Promise<ProductDetailResponse | null> {
        const product = await this.productRepository.findOne({
            where: { id },
            relations: ['images']
        });

        if (!product) {
            return null;
        }

        return this.transformProductToDetailResponse(product);
    }

    async getProducts(): Promise<ProductListItemResponse[]> {
        const products = await this.productRepository.find({
            relations: ['images'],
        });

        return products.map(product => this.transformProductToListItemResponse(product));
    }

    async createProduct(createProductRequest: CreateProductRequest): Promise<ProductDetailResponse> {
        const product = this.productRepository.create(createProductRequest);
        const savedProduct = await this.productRepository.save(product);
        return this.transformProductToDetailResponse(savedProduct);
    }

    async updateProduct(id: number, updateProductRequest: UpdateProductRequest): Promise<ProductDetailResponse> {
        const product = await this.productRepository.findOne({ 
            where: { id },
            relations: ['images']
        });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        // Обновляем только переданные поля
        Object.assign(product, updateProductRequest);
        
        const updatedProduct = await this.productRepository.save(product);
        return this.transformProductToDetailResponse(updatedProduct);
    }

    async deleteProduct(id: number): Promise<DeleteProductResponse> {
        const product = await this.productRepository.findOne({ where: { id } });
        
        if (!product) {
            throw new NotFoundException(`Товар с ID ${id} не найден`);
        }

        await this.productRepository.remove(product);
        
        return { message: `Товар "${product.name}" успешно удален` };
    }

    private transformProductToDetailResponse(product: Product): ProductDetailResponse {
        return {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            count: product.count,
            ...(product.createdAt && { createdAt: product.createdAt.toISOString() }),
            ...(product.updatedAt && { updatedAt: product.updatedAt.toISOString() }),
            ...(product.images && { 
                images: product.images.map(img => ({
                    id: img.id,
                    imageUrl: img.imageUrl,
                    altText: img.altText || '',
                    sortOrder: img.sortOrder,
                    isMain: img.isMain
                }))
            })
        };
    }

    private transformProductToListItemResponse(product: Product): ProductListItemResponse {
        // Находим главное изображение
        const mainImage = product.images?.find(img => img.isMain) || product.images?.[0];
        
        return {
            id: product.id,
            name: product.name,
            price: product.price,
            count: product.count,
            ...(mainImage && { mainImageUrl: mainImage.imageUrl }),
            ...(product.createdAt && { createdAt: product.createdAt.toISOString() })
        };
    }
}
