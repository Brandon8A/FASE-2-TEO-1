import { Injectable } from '@nestjs/common';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto/crear-publicacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publicacion } from './entidades/publicacion.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PublicacionService {

    constructor(
        @InjectRepository(Publicacion)
        private publicacionRepository: Repository<Publicacion>,
    ){}

    async crearPublicacion(dto:CrearPublicacionDto, file: any) {

        let rutaArchivo: string | undefined = undefined;

        if (file) {
            rutaArchivo = file.filename;
        }

        const nuevaPublicacion = this.publicacionRepository.create({
            descripcion: dto.descripcion,
            multimedia: rutaArchivo,
            usuario: { correo: dto.usuario_publica_fk }
        } as any);

        return await this.publicacionRepository.save(nuevaPublicacion);
    }

    async obtenerPublicaciones(){
        return await this.publicacionRepository.find({
            relations: ['usuario'],
            order: {
                fecha_publicacion: 'DESC'
            }
        })
    }
}