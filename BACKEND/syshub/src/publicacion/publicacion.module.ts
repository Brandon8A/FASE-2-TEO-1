import { Module } from '@nestjs/common';
import { PublicacionController } from './publicacion.controller';
import { PublicacionService } from './publicacion.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Publicacion } from './entidades/publicacion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Publicacion]),
    MulterModule.register({
    dest: './uploads', //Carpeta donde se almacenan los archivos
  })],
  controllers: [PublicacionController],
  providers: [PublicacionService]
})
export class PublicacionModule {}