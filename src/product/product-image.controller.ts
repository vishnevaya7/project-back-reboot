import {
    Controller,
    Post,
    Get,
    Delete,
    Param,
    UseInterceptors,
    UploadedFiles,
    UseGuards,
    Body,
    ParseIntPipe, Put
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { ProductImageService } from './product-image.service';
import { ProductImage } from './entities/product-image.entity';
import {
    ApiUploadProductImages,
    ApiGetProductImages,
    ApiDeleteProductImage,
    ApiSetMainProductImage,
    ApiUpdateProductImageOrder
} from '../swagger';

@ApiTags('Изображения товаров')
@Controller('product-images')
export class ProductImageController {
    constructor(private readonly productImageService: ProductImageService) {}

    @Post('upload/:productId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiUploadProductImages()
    @UseInterceptors(FilesInterceptor('files', 10, {
        storage: diskStorage({
            destination: './uploads/products',
            filename: (req, file, callback) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                const ext = extname(file.originalname);
                callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
            }
        }),
        fileFilter: (req, file, callback) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return callback(new Error('Разрешены только изображения!'), false);
            }
            callback(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB
        }
    }))
    async uploadImages(
        @Param('productId', ParseIntPipe) productId: number,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body() body: { altTexts?: string[] }
    ): Promise<ProductImage[]> {
        return this.productImageService.uploadImages(productId, files, body.altTexts);
    }

    @Get('product/:productId')
    @ApiGetProductImages()
    async getProductImages(@Param('productId', ParseIntPipe) productId: number): Promise<ProductImage[]> {
        return this.productImageService.getProductImages(productId);
    }

    @Delete(':imageId')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiDeleteProductImage()
    async deleteImage(@Param('imageId', ParseIntPipe) imageId: number): Promise<{ message: string }> {
        return this.productImageService.deleteImage(imageId);
    }

    @Put(':imageId/set-main')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiSetMainProductImage()
    async setMainImage(@Param('imageId', ParseIntPipe) imageId: number): Promise<ProductImage> {
        return this.productImageService.setMainImage(imageId);
    }

    @Put(':imageId/order')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @ApiUpdateProductImageOrder()
    async updateImageOrder(
        @Param('imageId', ParseIntPipe) imageId: number,
        @Body() body: { sortOrder: number }
    ): Promise<ProductImage> {
        return this.productImageService.updateImageOrder(imageId, body.sortOrder);
    }

}
