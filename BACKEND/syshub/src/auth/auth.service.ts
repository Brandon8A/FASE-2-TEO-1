import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/usuarios/entidades/rol.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,

        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,
    ){}

    async registrar(data: any){
        
        const rol = await this.rolRepository.findOne({
            where: { id_rol: data.rol }
        });

        if (!rol) {
            throw new Error('El rol no existe');
        }

        const saltRounds = 10;
        const contraseñaHash = await bcrypt.hash(data.contraseña, saltRounds)

        const nuevoUsuario = this.usuarioRepository.create({
            correo: data.correo,
            contraseña: contraseñaHash,
            nombre: data.nombre,
            rol: rol,
        });

        return await this.usuarioRepository.save(nuevoUsuario);
    }

    async login(dto: LoginDto){
        //Buscar usuario en DB
        const usuario = await this.usuarioRepository.findOne({
            where: { correo: dto.correo},
            relations: ['rol']
        });

        //Condicion para indicar que el usuario no existe
        if (!usuario) {
            throw new Error('Usuario no existe');
        } 

        //Validar contraseña
        const contraseñaValida = await bcrypt.compare(
            dto.contraseña,
            usuario.contraseña
        );

        if (!contraseñaValida) {
            throw new Error('Contraseña incorrecta')
        }

        console.log('Rol: ', usuario.rol);

        return {
            message: 'Login exitoso',
            usuario: {
                correo: usuario.correo,
                rol: usuario.rol.id_rol
            }
        }
    }
}