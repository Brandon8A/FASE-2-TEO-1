import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contenido } from 'src/usuarios/entidades/contenido/contenido';
import { Repository } from 'typeorm';
import { CrearContenidoDto } from './dto/crear-contenido.dto/crear-contenido.dto';

@Injectable()
export class ContenidoService {
    constructor(
        @InjectRepository(Contenido)
        private contenidoRepository: Repository<Contenido>,    
    ){}

    //Metodo para obtener los contenidos academicos que se encuentran registrados en la DB
    async obtenerContenido(){

        //Obteniendo y organizando cada tipo de contenido
        const pensums = await this.contenidoRepository.find({
            where: { tipo_contenido: 1 }
        });

        const categorias = await this.contenidoRepository.find({
            where: { tipo_contenido: 2 }
        });

        const areas = await this.contenidoRepository.find({
            where: { tipo_contenido: 3 }
        });

        return { pensums, categorias, areas };
    }

    //Metodo para corear un nuevo contenido
    async crearContenido(data: CrearContenidoDto){
        const nuevoContenido = this.contenidoRepository.create(data)
        return await this.contenidoRepository.save(nuevoContenido)
    }
}
