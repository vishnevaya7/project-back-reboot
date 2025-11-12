import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {And, Equal, FindOperator, ILike, In, LessThanOrEqual, Or, Repository} from "typeorm";
import {
    CreateProductRequest,
    UpdateProductRequest,
    ProductDetailResponse,
    ProductListItemResponse,
    DeleteProductResponse, GetProductPredicate
} from "../swagger/dto";
import {ProductRepository} from "./product.repository";
import {Pageable} from "../swagger/dto/pageable";
import {Page} from "../swagger/dto/page";
import {MoreThanOrEqual} from "typeorm/find-options/operator/MoreThanOrEqual";

@Injectable()
export class ProductService {
    constructor(
        private productRepository: ProductRepository,
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

    async getProducts(pageable: Pageable, predicate?: GetProductPredicate): Promise<Page<ProductListItemResponse>> {

        const whereConditions: any = {};
        if(predicate) {
            if(predicate.id && predicate.id.length > 0) whereConditions.id = In(predicate.id);

            const nameConditions: FindOperator<any>[] = [];
            if(predicate.name && predicate.name.length > 0) {
                nameConditions.push(In(predicate.name));
            }
            if(predicate.nameLike) {
                nameConditions.push(ILike(`%${predicate.nameLike}%`));
            }
            if(nameConditions.length > 0) {
                if(nameConditions.length === 1) {
                    whereConditions.name = nameConditions[0];
                } else {
                    whereConditions.name = Or(...nameConditions);
                }
            }

            const descriptionConditions: FindOperator<any>[] = [];
            if(predicate.description && predicate.description.length > 0) {
                descriptionConditions.push(In(predicate.description));
            }
            if(predicate.descriptionContains) {
                descriptionConditions.push(ILike(`%${predicate.descriptionContains}%`));
            }
            if(descriptionConditions.length > 0) {
                if(descriptionConditions.length === 1) {
                    whereConditions.description = descriptionConditions[0];
                } else {
                    whereConditions.description = Or(...descriptionConditions);
                }
            }

            const countConditions: FindOperator<any>[] = [];
            if(predicate.count && predicate.count.length > 0) {
                countConditions.push(In(predicate.count));
            }
            if(predicate.countFrom !== undefined) {
                countConditions.push(MoreThanOrEqual(predicate.countFrom));
            }
            if(predicate.countTo !== undefined) {
                countConditions.push(LessThanOrEqual(predicate.countTo));
            }
            if(countConditions.length > 0) {
                if(countConditions.length === 1) {
                    whereConditions.count = countConditions[0];
                } else {
                    whereConditions.count = And(...countConditions);
                }
            }

            const priceConditions: FindOperator<any>[] = [];
            if(predicate.priceFrom !== undefined) {
                priceConditions.push(MoreThanOrEqual(predicate.priceFrom))
            }
            if(predicate.priceTo !== undefined) {
                priceConditions.push(LessThanOrEqual(predicate.priceTo));
            }

            if(priceConditions.length > 0) {
                if(priceConditions.length === 1) {
                    whereConditions.price = priceConditions[0];
                } else {
                    whereConditions.price = And(...priceConditions);
                }
            }

            const createdAtConditions: FindOperator<any>[] = [];
            if(predicate.createdFrom !== undefined) {
                createdAtConditions.push(MoreThanOrEqual(predicate.createdFrom));
            }
            if(predicate.createdTo !== undefined) {
                createdAtConditions.push(LessThanOrEqual(predicate.createdTo));
            }

            if(createdAtConditions.length > 0) {
                if(createdAtConditions.length === 1) {
                    whereConditions.createdAt = createdAtConditions[0];
                } else {
                    whereConditions.createdAt = And(...createdAtConditions);
                }
            }

            const updatedAtConditions: FindOperator<any>[] = [];
            if(predicate.updatedFrom !== undefined) {
                updatedAtConditions.push(MoreThanOrEqual(predicate.updatedFrom));
            }
            if(predicate.updatedTo !== undefined) {
                updatedAtConditions.push(LessThanOrEqual(predicate.updatedTo));
            }

            if(updatedAtConditions.length > 0) {
                if(updatedAtConditions.length === 1) {
                    whereConditions.updatedAt = updatedAtConditions[0];
                } else {
                    whereConditions.updatedAt = And(...updatedAtConditions);
                }
            }

        }
        return (await this.productRepository.getPage(pageable, whereConditions))
            .map<ProductListItemResponse>(this.transformProductToListItemResponse);
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
