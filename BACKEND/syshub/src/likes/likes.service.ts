import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Likes } from './entidades/likes.entity';
import { Repository } from 'typeorm';
import { Publicacion } from 'src/publicacion/entidades/publicacion.entity';
import { PublicacionGateway } from 'src/publicacion/publicacion.gateway';

@Injectable()
export class LikesService {

    constructor(
        @InjectRepository(Likes)
        private likeRepository: Repository<Likes>,
        
        @InjectRepository(Publicacion)
        private publicacionRepository: Repository<Publicacion>,

        private gateway: PublicacionGateway
    ){}

    async toggleLike(publicacionId: number, correo: string) {

        const existe = await this.likeRepository.findOne({
          where: {
            usuario: { correo },
            publicacion: { id_publicacion: publicacionId }
          },
          relations: ['usuario', 'publicacion']
        });

        let liked = false;

        if (existe) {
          //Quitar like
          await this.likeRepository.remove(existe);
          liked = false;
        } else {
          // Agregar like
          const nuevoLike = this.likeRepository.create({
            usuario: { correo },
            publicacion: { id_publicacion: publicacionId }
          });
      
          await this.likeRepository.save(nuevoLike);
          liked = true;
        }

        // Contar likes reales
        const totalLikes = await this.likeRepository.count({
          where: {
            publicacion: { id_publicacion: publicacionId }
          }
        });

        // 🔥 actualizar contador en PUBLICACION
        await this.publicacionRepository.update(publicacionId, {
          likes: totalLikes
        });

        // 🔥 emitir en tiempo real
        this.gateway.emitirLike(publicacionId, totalLikes);

        return {
          liked,
          totalLikes
        };
}
}
