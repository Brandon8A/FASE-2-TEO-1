import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Rol } from 'src/usuarios/entidades/rol.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([Usuario, Rol]),
        JwtModule.register({
            secret: 'recovery_secret'
        })],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule { }
