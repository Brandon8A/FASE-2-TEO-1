import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ComentarioService } from './comentario.service';
import { CrearComentarioDto } from './dto/crear-comentario.dto/crear-comentario.dto';

@Controller('comentario')
export class ComentarioController {

    constructor(private comentarioService: ComentarioService){}

    //Crear comentario
    @Post()
    crearComentario(@Body() dto: CrearComentarioDto){
        console.log('Entrando a controlador comentario, metodo post crearComentario()')
        return this.comentarioService.crearComentario(dto)
    }

    //Metodo para obtener los comentarios de una publicacion en especifico
    @Get('publicacion/:id')
    obtenerComentarios(@Param('id') id: number){
        console.log('Ingresando a controlador comentario, metodo Get() obtenerComentarios');
        
        return this.comentarioService.obtenerComentariosPorPublicacion(id)
    }
}
