import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProyectoService } from './proyecto.service';
import { CrearProyectoDto } from './dto/crear-proyecto.dto/crear-proyecto.dto';

@Controller('proyecto')
export class ProyectoController {
    constructor(
        private readonly proyectoService: ProyectoService
    ) { }

    @Post()
    @UseInterceptors(
        FileInterceptor('archivo', {
            storage: diskStorage({
                destination: './uploads',

                filename: (req, file, callback) => {

                    const nombre =
                        Date.now() +
                        extname(file.originalname)

                    callback(null, nombre)
                }
            })
        })
    )
    async crearProyecto(
        @UploadedFile() archivo: Express.Multer.File,
        @Body() body: CrearProyectoDto
    ) {
        console.log('Ingresando a controlador proyecto metodo Post')
        return this.proyectoService.crearProyecto(
            body,
            archivo?.filename
        )
    }

    //Metodo get para obtener proyectos del usuario que es mandado por parametro
    @Get('usuario/:correo')
    async obtenerProyectosUsuario(
        @Param('correo') correo: string
    ) {
        return this.proyectoService.obtenerProyectosUsuario(correo)
    }
}
