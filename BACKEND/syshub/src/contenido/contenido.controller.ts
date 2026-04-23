import { Body, Controller, Get, Post } from '@nestjs/common';
import { ContenidoService } from './contenido.service';
import { CrearContenidoDto } from './dto/crear-contenido.dto/crear-contenido.dto';

@Controller('admin')
export class ContenidoController {

    constructor(private contenidoService: ContenidoService){

    }

    //Metodo get que obtiene todo los datos que tienen que ver con la clasificacion sistemica
    @Get('contenido')
    obtenerContenidos(){
        console.log('Entrando a controlador admin, metodo get()')
        const contenido = this.contenidoService.obtenerContenido();
        console.log('Contenido: ', contenido)
        return contenido
    }

    @Post('contenido')
    crear(@Body() data: CrearContenidoDto){
        return this.contenidoService.crearContenido(data);
    }
}
