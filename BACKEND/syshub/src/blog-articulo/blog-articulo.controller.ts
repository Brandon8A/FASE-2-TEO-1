import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { BlogArticuloService } from './blog-articulo.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrearBlogArticuloDto } from './dto/crear-blog-articulo.dto/crear-blog-articulo.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('blog-articulo')
export class BlogArticuloController {

    constructor(
        private readonly blogService: BlogArticuloService
    ) { }

    // CREAR BLOG
    @Post()
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({

                // CARPETA
                destination: './uploads/blogs-articulos',

                // NOMBRE ARCHIVO
                filename: (req, file, callback) => {
                    const uniqueName =
                        Date.now() + '-' + Math.round(Math.random() * 1e9)
                    callback(
                        null,
                        `${uniqueName}${extname(file.originalname)}`
                    )
                }
            })
        })
    )
    crearBlog(
        @Body() dto: CrearBlogArticuloDto,
        @UploadedFile() file?: Express.Multer.File
    ) {
        return this.blogService.crearBlog(dto, file)
    }

    // OBTENER BLOGS DEL USUARIO
    @Get('usuario/:correo')
    obtenerBlogsUsuario(
        @Param('correo') correo: string
    ) {
        return this.blogService.obtenerBlogsUsuario(correo)
    }
}