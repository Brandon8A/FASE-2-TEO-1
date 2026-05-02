import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Destacado } from './entidades/destacado.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Proyecto } from 'src/proyecto/entidades/proyecto.entity';

@Injectable()
export class DestacadoService {

    constructor(

        @InjectRepository(Destacado)
        private destacadoRepository: Repository<Destacado>,

        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,

        @InjectRepository(Proyecto)
        private proyectoRepository: Repository<Proyecto>

    ) { }

    async destacarProyecto(body: any, files: any) {

        // BUSCAR AUXILIAR
        const auxiliar = await this.usuarioRepository.findOne({
            where: {
                correo: body.usuario_auxiliar_fk
            }
        })

        // BUSCAR PROYECTO
        const proyecto = await this.proyectoRepository.findOne({
            where: {
                id_proyecto: body.proyecto_fk
            }
        })

        // CREAR DESTACADO
        const destacado = this.destacadoRepository.create({

            usuarioDestaca: auxiliar!,
            proyecto: proyecto!,

            // ARCHIVO GENERAL
            path_guias:
                files?.archivo?.[0]
                    ? `uploads/destacados/guias/${files.archivo[0].filename}`
                    : null,

            // VIDEO
            path_grabaciones:
                files?.video?.[0]
                    ? `uploads/destacados/videos/${files.video[0].filename}`
                    : null,

            // ENLACE
            path_material:
                body.enlace || null

        })

        return await this.destacadoRepository.save(destacado)

    }

    async obtenerDestacadosAuxiliar(correo: string) {

        return this.destacadoRepository.find({
            where: {
                usuarioDestaca: {
                    correo: correo
                }
            },
            relations: [
                'usuarioDestaca',
                'proyecto',
                'proyecto.usuario'
            ],
            order: {
                id_curaduria: 'DESC'
            }
        })
    }
}