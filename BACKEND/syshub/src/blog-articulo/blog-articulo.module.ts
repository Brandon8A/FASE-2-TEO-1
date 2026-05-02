import { Module } from '@nestjs/common';
import { BlogArticuloController } from './blog-articulo.controller';
import { BlogArticuloService } from './blog-articulo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogArticulo } from './entidades/blog-articulo.entity';

@Module({
  imports:[TypeOrmModule.forFeature([BlogArticulo])],
  controllers: [BlogArticuloController],
  providers: [BlogArticuloService]
})
export class BlogArticuloModule {}
