import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entidades/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ){}

    async crearUsuario(data: Partial<Usuario>){
        //Encriptar contraseña
        if (!data.contraseña) {
            throw new Error('La contraseña es obligatoria');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.contraseña, salt);

        const usuario = this.usuarioRepository.create({
            ...data,
            contraseña: passwordHash,
        });
        return this.usuarioRepository.save(usuario);
    }
}