import { Module } from '@nestjs/common';
import { PublicacionController } from './publicacion.controller';
import { PublicacionService } from './publicacion.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion } from './entidades/publicacion.entity';
import { PublicacionGateway } from './publicacion.gateway';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Likes } from 'src/likes/entidades/likes.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacion, Usuario, Likes]),
    MulterModule.register({
    dest: './uploads', //Carpeta donde se almacenan los archivos
  })],
  controllers: [PublicacionController],
  providers: [PublicacionService, PublicacionGateway],
  exports: [PublicacionGateway]
})
export class PublicacionModule {}