import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyecto } from './entidades/proyecto.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProyectoService {
    constructor(
        @InjectRepository(Proyecto)
        private proyectoRepository: Repository<Proyecto>
    ) { }

    async crearProyecto(body: any, nombreArchivo: string) {
        console.log('Entrando al servicio, metodo crearProyecto()')
        const nuevoProyecto = this.proyectoRepository.create({

            titulo: body.titulo,

            descripcion: body.descripcion,

            stack: body.stack,

            etiquetas: body.etiquetas,

            path_archivo: nombreArchivo,

            usuario: {
                correo: body.id_usuario_proyecto
            }
        })

        return await this.proyectoRepository.save(
            nuevoProyecto
        )
    }

    async obtenerProyectosUsuario(
        correo: string
    ) {

        return await this.proyectoRepository.find({

            where: {
                usuario: {
                    correo
                }
            },

            relations: ['usuario'],

            order: {
                id_proyecto: 'DESC'
            }
        })
    }
}
