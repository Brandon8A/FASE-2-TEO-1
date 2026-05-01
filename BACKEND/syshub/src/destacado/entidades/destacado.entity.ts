import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Proyecto } from 'src/proyecto/entidades/proyecto.entity';

@Entity('DESTACADO')
export class Destacado {

    @PrimaryGeneratedColumn()
    id_curaduria?: number;

    @Column({
        nullable: true
    })
    path_guias?: string;

    @Column({
        nullable: true
    })
    path_grabaciones?: string;

    @Column({
        nullable: true
    })
    path_material?: string;

    // AUXILIAR
    @ManyToOne(() => Usuario)
    @JoinColumn({
        name: 'id_usuario_destaca_fk',
        referencedColumnName: 'correo'
    })
    usuarioDestaca?: Usuario;

    // PROYECTO
    @ManyToOne(() => Proyecto)
    @JoinColumn({
        name: 'id_proyecto_fk'
    })
    proyecto?: Proyecto;

}