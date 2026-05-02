import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto/crear-publicacion.dto';
import { diskStorage } from 'multer'

@Controller('publicacion')
export class PublicacionController {

    constructor(private publicacionesService: PublicacionService) { }

    //Metodo post para crear publicaciones
    @Post()
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const nombre = `${Date.now()}-${file.originalname}`;
                cb(null, nombre);
            }
        })
    }))
    async crearPublicacion(@UploadedFile() file: any, @Body() dto: CrearPublicacionDto) {
        //console.log('Entrando a controlador publicacion, endpoint crearPublicacion')
        return this.publicacionesService.crearPublicacion(dto, file);
    }

    //Metodo get que obtiene todas las publicaciones
    @Get()
    obtenerPublicaciones() {
        return this.publicacionesService.obtenerPublicaciones();
    }

    //Metodo post que permite dar like a una publicacion
    @Post(':id/like')
    darLike(@Param('id') id: number, @Body('correo') correo: string) {
        console.log('\n\nIngresando a controlador Publicacion metodo Post(:id/like)\n\n')
        return this.publicacionesService.toggleLike(id, correo)
    }

    //Metodo para obtener publicaciones de un usuario
    @Get('usuario/:correo')
    obtenerPublicacionesUsuario(
        @Param('correo') correo: string
    ) {
        return this.publicacionesService.obtenerPorUsuario(correo)
    }
}
