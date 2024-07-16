import {applyDecorators, UseInterceptors} from "@nestjs/common";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import { extname } from 'path';

export function UploadFileDecorator() {
    return applyDecorators(
        UseInterceptors(
            FileInterceptor('file', {
                storage: diskStorage({
                    destination: './uploads',
                    filename: (_req, file, callback) => {
                        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                        const ext = extname(file.originalname);
                        callback(null, `${uniqueSuffix}${ext}`);
                    },
                }),
                fileFilter: (_req, file, callback) => {
                    if (file.mimetype !== 'application/pdf') {
                        return callback(new Error('Only PDF files are allowed!'), false);
                    }
                    callback(null, true);
                },
            }),
        )
    )
}