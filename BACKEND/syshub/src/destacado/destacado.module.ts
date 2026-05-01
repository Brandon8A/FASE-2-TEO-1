import { Module } from '@nestjs/common';
import { DestacadoController } from './destacado.controller';
import { DestacadoService } from './destacado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Destacado } from './entidades/destacado.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Proyecto } from 'src/proyecto/entidades/proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Destacado, Usuario, Proyecto])
  ],
  controllers: [DestacadoController],
  providers: [DestacadoService]
})
export class DestacadoModule { }
