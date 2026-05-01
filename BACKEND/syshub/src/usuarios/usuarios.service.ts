import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entidades/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {

    constructor(
        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,
    ) { }

    //Metodo para crear usuarios en la base de datos
    async crearUsuario(data: Partial<Usuario>) {
        //Encriptar contraseña
        if (!data.contraseña) {
            throw new Error('La contraseña es obligatoria');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(data.contraseña, salt);//obteniendo contraseña encriptada(hasheada)

        const usuario = this.usuarioRepository.create({
            ...data,
            contraseña: passwordHash,
        });
        return this.usuarioRepository.save(usuario);
    }

    //Metodo para obtener todos los usuarios del sistema
    async obtenerUsuariosNoEliminados() {
        return this.usuarioRepository.find({
            where: {
                eliminado: false
            },
            relations: ['rol']
        });
    }

    //Metodo para actualizar el estado suspendido de un usuario
    async actualizarEstado(correo: string, suspendido: boolean) {
        // Buscar usuario por correo
        const usuario = await this.usuarioRepository.findOne({
            where: { correo: correo }
        });

        if (!usuario) {
            throw new Error('Usuario no encontrado');
        }

        // Actualizar estado
        usuario.suspendido = suspendido;

        // Guardar cambios
        return await this.usuarioRepository.save(usuario);
    }

    async eliminar(correo: string) {
        //Obtener usuario a eliminar
        const usuario = await this.usuarioRepository.findOne({
            where: { correo: correo }
        })

        //Condicion que indica si el usuario a buscar existe o no
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado')
        }

        //"Eliminar" usuario
        usuario.eliminado = true;

        return await this.usuarioRepository.save(usuario);
    }

    async actualizar(correo: string, data: any) {
        const usuario = await this.usuarioRepository.findOne({
            where: { correo }
        });

        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }

        if (data.nombre) usuario.nombre = data.nombre;
        if (data.rol) usuario.rol = data.rol;

        if (data.contraseña) {
            usuario.contraseña = await bcrypt.hash(data.contraseña, 10);
        }

        return this.usuarioRepository.save(usuario);
    }

    // OBTENER SOLO ESTUDIANTES
    async obtenerEstudiantes() {

        const estudiantes = await this.usuarioRepository.find({
            where: {
                rol: {
                    id_rol: 1
                }
            },
            select: {
                correo: true,
                nombre: true,
                rol: true
            }
        })

        return estudiantes

    }
}