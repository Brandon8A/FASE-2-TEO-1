import { Module } from '@nestjs/common';
import { ComentarioController } from './comentario.controller';
import { ComentarioService } from './comentario.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comentario } from './entidades/comentario.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Comentario])],
  controllers: [ComentarioController],
  providers: [ComentarioService]
})
export class ComentarioModule {}
