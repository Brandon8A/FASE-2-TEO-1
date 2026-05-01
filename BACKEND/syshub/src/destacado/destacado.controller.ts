import {
    Body,
    Controller,
    Post,
    UploadedFiles,
    UseInterceptors
} from '@nestjs/common';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { diskStorage } from 'multer';
import { extname } from 'path';

import { DestacadoService } from './destacado.service';
import { CrearDestacadoDto } from './dto/crear-destacado.dto/crear-destacado.dto';

@Controller('proyecto')
export class DestacadoController {

    constructor(
        private readonly destacadoService: DestacadoService
    ) { }

    @Post('destacar')
    @UseInterceptors(FileFieldsInterceptor(
        [
            { name: 'archivo', maxCount: 1 },
            { name: 'video', maxCount: 1 }
        ],

        {
            storage: diskStorage({
                destination: './uploads/destacados',
                filename: (req, file, callback) => {
                    const uniqueName =
                        Date.now() +
                        '-' +
                        Math.round(Math.random() * 1e9) +
                        extname(file.originalname);

                    callback(null, uniqueName);
                }
            })
        }
    )
    )

    async destacarProyecto(
        @UploadedFiles()
        files: {
            archivo?: Express.Multer.File[],
            video?: Express.Multer.File[]
        },
        @Body()
        body: CrearDestacadoDto
    ) {
        console.log('Entrando a controlador proyecto')
        return this.destacadoService.destacarProyecto(
            body,
            files
        );
    }
}