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

    //Metodo post para crear un nuevo proyecto
    @Post()
    @UseInterceptors(
        FileInterceptor('archivo', {//Obteniendo archivo
            storage: diskStorage({
                destination: './uploads',//destino del archivo

                filename: (req, file, callback) => {

                    const nombre = Date.now() + extname(file.originalname)//Estableciendo el nombre del archivo
                    callback(null, nombre)
                }
            })
        })
    )
    async crearProyecto(@UploadedFile() archivo: Express.Multer.File, @Body() body: CrearProyectoDto) {
//        console.log('Ingresando a controlador proyecto metodo Post')
        return this.proyectoService.crearProyecto(body, archivo?.filename)//Retornando y accediendo al servicio para la creacion de un proyecto
    }

    //Metodo get para obtener proyectos del usuario que es mandado por parametro
    @Get('usuario/:correo')
    async obtenerProyectosUsuario(
        @Param('correo') correo: string
    ) {
        return this.proyectoService.obtenerProyectosUsuario(correo)
    }
}
