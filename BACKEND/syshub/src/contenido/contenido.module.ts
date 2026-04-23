import { Module } from '@nestjs/common';
import { ContenidoController } from './contenido.controller';
import { ContenidoService } from './contenido.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contenido } from 'src/usuarios/entidades/contenido/contenido';

@Module({
  imports: [TypeOrmModule.forFeature([Contenido])],
  controllers: [ContenidoController],
  providers: [ContenidoService]
})
export class ContenidoModule {
  
}
