import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { Usuario } from './usuarios/entidades/usuario.entity';
import { Rol } from './usuarios/entidades/rol.entity';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'brandon031200',
      database: 'SYSHUB',
      entities: [Usuario, Rol],
      synchronize: true,
    }),
    UsuariosModule
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}