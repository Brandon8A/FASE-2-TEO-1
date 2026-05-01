import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './usuarios/entidades/usuario.entity';
import { Rol } from './usuarios/entidades/rol.entity';
import { AuthModule } from './auth/auth.module';
import { Contenido } from './usuarios/entidades/contenido/contenido';
import { TipoContenido } from './usuarios/entidades/tipo-contenido/tipo-contenido';
import { ContenidoModule } from './contenido/contenido.module';
import { PublicacionModule } from './publicacion/publicacion.module';
import { Publicacion } from './publicacion/entidades/publicacion.entity';
import { LikesModule } from './likes/likes.module';
import { Likes } from './likes/entidades/likes.entity';
import { ComentarioModule } from './comentario/comentario.module';
import { Comentario } from './comentario/entidades/comentario.entity';
import { ProyectoModule } from './proyecto/proyecto.module';
import { Proyecto } from './proyecto/entidades/proyecto.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'brandon031200',
      database: 'SYSHUB',
      entities: [Usuario, Rol, Contenido, TipoContenido, Publicacion, Likes, Comentario, Proyecto],
      synchronize: true,
      logging: true,
    }),
    UsuariosModule,
    AuthModule,
    ContenidoModule,
    PublicacionModule,
    LikesModule,
    ComentarioModule,
    ProyectoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}