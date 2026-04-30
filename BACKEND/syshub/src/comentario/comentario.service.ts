import { Injectable } from '@nestjs/common';
import { CrearComentarioDto } from './dto/crear-comentario.dto/crear-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentario } from './entidades/comentario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComentarioService {

    constructor(
        @InjectRepository(Comentario)
        private comentarioRepository: Repository<Comentario>
    ) { }

    async crearComentario(dto: CrearComentarioDto) {
        console.log('Entrando al servicio de comentario, metodo crearComentario')
        const nuevoComentario = this.comentarioRepository.create({
            contenido: dto.contenido,
            usuario: { correo: dto.usuario_comentar_fk },
            publicacion: { id_publicacion: dto.id_publicacion_fk },
            comentarioPadre: dto.id_comentario_responder
                ? { id_comentario: dto.id_comentario_responder }
                : null
        } as any);

        return await this.comentarioRepository.save(nuevoComentario);
    }

    async obtenerComentariosPorPublicacion(id: number) {
        console.log('\nServicio comentario.service, metodo obtenerComentariosPorPublicacion\n')
        return await this.comentarioRepository.find({
            where: {
                publicacion: { id_publicacion: id }
            },
            relations: ['usuario', 'comentarioPadre'],
            order: { id_comentario: 'ASC' }
        });
    }
}
