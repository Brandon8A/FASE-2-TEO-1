import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entidades/usuario.entity';
import { Rol } from './entidades/rol.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Rol])],
  providers: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
