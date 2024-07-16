import { Post, UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UploadLogoDecorator() {
    return applyDecorators(
        UseGuards(AuthenticationGuard),
        UseInterceptors(
            FileInterceptor('logo', {
                storage: diskStorage({
                    destination: 'public/uploads/image',
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            }),
        ),
        Post('logo/:id'),
    );
}
