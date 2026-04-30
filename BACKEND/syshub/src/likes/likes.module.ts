import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion } from 'src/publicacion/entidades/publicacion.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Likes } from './entidades/likes.entity';
import { PublicacionModule } from 'src/publicacion/publicacion.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacion, Usuario, Likes]),
    PublicacionModule
  ],
  controllers: [LikesController],
  providers: [LikesService]
})
export class LikesModule {}
