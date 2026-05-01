import { Usuario } from 'src/usuarios/entidades/usuario.entity'
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm'


@Entity('PROYECTO')
export class Proyecto {

    @PrimaryGeneratedColumn()
    id_proyecto!: number

    @Column({
        type: 'varchar',
        length: 150
    })
    titulo!: string

    @Column({
        type: 'varchar',
        length: 250
    })
    descripcion!: string

    @Column({
        type: 'varchar',
        length: 400
    })
    stack!: string

    @Column({
        type: 'varchar',
        length: 150
    })
    etiquetas!: string

    @Column({
        type: 'varchar',
        length: 150,
        nullable: true
    })
    path_archivo!: string

    // RELACION CON USUARIO
    @ManyToOne(
        () => Usuario,
        usuario => usuario.proyectos
    )
    @JoinColumn({
        name: 'id_usuario_proyecto'
    })
    usuario!: Usuario
}