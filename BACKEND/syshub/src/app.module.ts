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

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'brandon031200',
      database: 'SYSHUB',
      entities: [Usuario, Rol, Contenido, TipoContenido],
      synchronize: true,
      logging: true,
    }),
    UsuariosModule,
    AuthModule,
    ContenidoModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}