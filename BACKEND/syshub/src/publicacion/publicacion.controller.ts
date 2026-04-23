import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { PublicacionService } from './publicacion.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto/crear-publicacion.dto';

@Controller('publicacion')
export class PublicacionController {

    constructor(private publicacionesService: PublicacionService){}

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async crearPublicacion(@UploadedFile() file: any, @Body() dto: CrearPublicacionDto){
        return this.publicacionesService.crearPublicacion(dto, file);
    }

    @Get()
    obtenerPublicaciones(){
        return this.publicacionesService.obtenerPublicaciones();
    }
}
