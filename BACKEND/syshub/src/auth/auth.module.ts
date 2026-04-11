import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Rol } from 'src/usuarios/entidades/rol.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Usuario, Rol])],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
