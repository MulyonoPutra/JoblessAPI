import { Post, UseGuards, UseInterceptors, applyDecorators } from '@nestjs/common';

import { AuthenticationGuard } from '../guards/authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

export function UploadImageDecorator(fieldName: string) {
    return applyDecorators(
        UseGuards(AuthenticationGuard),
        UseInterceptors(
            FileInterceptor(fieldName, {
                storage: diskStorage({
                    destination: `public/uploads/image/${fieldName}`,
                    filename: (req, file, cb) => {
                        cb(null, file.originalname);
                    },
                }),
            }),
        ),
        Post(`upload/${fieldName}/:id`),
    );
}
