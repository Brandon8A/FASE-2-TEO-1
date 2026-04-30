import { Injectable } from '@nestjs/common';
import { CrearPublicacionDto } from './dto/crear-publicacion.dto/crear-publicacion.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Publicacion } from './entidades/publicacion.entity';
import { Repository } from 'typeorm';
import { Likes } from 'src/likes/entidades/likes.entity';
import { PublicacionGateway } from './publicacion.gateway';

@Injectable()
export class PublicacionService {
  constructor(
    @InjectRepository(Publicacion)
    private publicacionRepository: Repository<Publicacion>,
        
    @InjectRepository(Likes)
    private likeRepository:Repository<Likes>,

    private gateway: PublicacionGateway
  ){}

  //Metodo para crear publicacion en el sistema
  async crearPublicacion(dto:CrearPublicacionDto, file: any) {
      let rutaArchivo: string | undefined = undefined;
      if (file) {
          rutaArchivo = file.filename;
      }
      const nuevaPublicacion = this.publicacionRepository.create({
          descripcion: dto.descripcion,
          multimedia: file ? file.filename: null,
          usuario: { correo: dto.usuario_publica_fk },
          tipo: dto.tipo || 'POST'
      } as any);
      return await this.publicacionRepository.save(nuevaPublicacion);
  }
  
  //Metodo para obtener todas las publicaciones registradas en la DB
  async obtenerPublicaciones(){
      return await this.publicacionRepository.find({
          relations: ['usuario'],
          order: {
              fecha_publicacion: 'DESC'
          }
      })
  }
  async toggleLike(publicacionId: number, correo: string) {

    console.log('correo:', correo);
    console.log('publicacionId:', publicacionId);

    const existe = await this.likeRepository.findOne({
      where: {
        usuario: { correo: correo },
        publicacion: { id_publicacion: publicacionId }
      },
      relations: ['usuario', 'publicacion']
    });
  
    let liked = false;
  
    if (existe) {
      //quitar like
      await this.likeRepository.remove(existe);
      liked = false;
    } else {
      // agregar like
      const nuevoLike = this.likeRepository.create({
        usuario: { correo },
        publicacion: { id_publicacion: publicacionId }
      });
    
      await this.likeRepository.save(nuevoLike);
      liked = true;
    }
  
    // contar likes reales
    const totalLikes = await this.likeRepository.count({
      where: {
        publicacion: { id_publicacion: publicacionId }
      }
    });
  
    // actualizar contador en PUBLICACION
    await this.publicacionRepository.update(publicacionId, {
      likes: totalLikes
    });
  
    //emitir en tiempo real
    this.gateway.emitirLike(publicacionId, totalLikes);
  
    return {
      liked,
      totalLikes
    };
  }
}