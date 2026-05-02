import {Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
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

    //Metodo post que permite destacar proyectos
    @Post('destacar')
    @UseInterceptors(
        FileFieldsInterceptor(
            [
                { name: 'archivo', maxCount: 1 },
                { name: 'video', maxCount: 1 }
            ],
            {
                storage: diskStorage({

                    // DESTINO DINÁMICO
                    destination: (req, file, callback) => {

                        // GUIAS / ARCHIVOS
                        if (file.fieldname === 'archivo') {
                            callback(
                                null,
                                './uploads/destacados/guias'
                            )
                        }

                        // VIDEOS
                        else if (file.fieldname === 'video') {
                            callback(
                                null,
                                './uploads/destacados/videos'
                            )
                        }
                    },

                    // NOMBRE ARCHIVO
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
        return this.destacadoService.destacarProyecto(
            body,
            files
        );
    }

    // OBTENER DESTACADOS POR AUXILIAR
    @Get('destacados/:correo')
    obtenerDestacadosAuxiliar(@Param('correo') correo: string) {
        return this.destacadoService.obtenerDestacadosAuxiliar(correo)
    }

}