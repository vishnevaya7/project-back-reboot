import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';
import { Product } from './entities/product.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ProductImageService {
    constructor(
        @InjectRepository(ProductImage)
        private readonly productImageRepository: Repository<ProductImage>,
        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>
    ) {}

    async uploadImages(
        productId: number,
        files: Array<Express.Multer.File>,
        altTexts?: string[]
    ): Promise<ProductImage[]> {
        // Проверяем существование товара
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Товар с ID ${productId} не найден`);
        }

        if (!files || files.length === 0) {
            throw new BadRequestException('Не загружено ни одного файла');
        }

        // Создаем папку для загрузок, если её нет
        const uploadDir = './uploads/products';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const savedImages: ProductImage[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const altText = altTexts && altTexts[i] ? altTexts[i] : undefined;

            // Получаем текущее максимальное значение sortOrder для товара
            const maxSortOrder = await this.productImageRepository
                .createQueryBuilder('image')
                .select('MAX(image.sortOrder)', 'maxOrder')
                .where('image.productId = :productId', { productId })
                .getRawOne();

            const nextSortOrder = (maxSortOrder?.maxOrder || 0) + 1;

            // Проверяем, есть ли уже главное изображение
            const hasMainImage = await this.productImageRepository.findOne({
                where: { productId, isMain: true }
            });

            const productImage = this.productImageRepository.create({
                productId,
                imageUrl: `/uploads/products/${file.filename}`,
                altText,
                sortOrder: nextSortOrder,
                isMain: !hasMainImage // Первое изображение становится главным, если нет других
            });

            const savedImage = await this.productImageRepository.save(productImage);
            savedImages.push(savedImage);
        }

        return savedImages;
    }

    async getProductImages(productId: number): Promise<ProductImage[]> {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new NotFoundException(`Товар с ID ${productId} не найден`);
        }

        return this.productImageRepository.find({
            where: { productId },
            order: { sortOrder: 'ASC' }
        });
    }

    async deleteImage(imageId: number): Promise<{ message: string }> {
        const image = await this.productImageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException(`Изображение с ID ${imageId} не найдено`);
        }

        // Удаляем файл с диска
        const filePath = path.join('.', image.imageUrl);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Удаляем запись из БД
        await this.productImageRepository.remove(image);

        return { message: 'Изображение успешно удалено' };
    }

    async setMainImage(imageId: number): Promise<ProductImage> {
        const image = await this.productImageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException(`Изображение с ID ${imageId} не найдено`);
        }

        // Убираем флаг главного изображения у всех изображений товара
        await this.productImageRepository.update(
            { productId: image.productId },
            { isMain: false }
        );

        // Устанавливаем текущее изображение как главное
        image.isMain = true;
        return this.productImageRepository.save(image);
    }

    async updateImageOrder(imageId: number, newSortOrder: number): Promise<ProductImage> {
        const image = await this.productImageRepository.findOne({ where: { id: imageId } });
        if (!image) {
            throw new NotFoundException(`Изображение с ID ${imageId} не найдено`);
        }

        image.sortOrder = newSortOrder;
        return this.productImageRepository.save(image);
    }
}
