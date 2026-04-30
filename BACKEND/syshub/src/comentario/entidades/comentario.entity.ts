import { Publicacion } from "src/publicacion/entidades/publicacion.entity";
import { Usuario } from "src/usuarios/entidades/usuario.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('COMENTARIO')
export class Comentario{

    @PrimaryGeneratedColumn()
    id_comentario?: number;

    @Column({ type: 'varchar', length: 200})
    contenido?: string;

    //Relacion con Usuario
    @ManyToOne(() => Usuario, (usuario) => usuario.comentarios)
    @JoinColumn({name: 'usuario_comentar_fk'})
    usuario?: Publicacion

    //Relacion con publicacion
    @ManyToOne(() => Publicacion, (publicacion) => publicacion.comentarios)
    @JoinColumn({ name: 'id_publicacion_fk' })
    publicacion?: Publicacion;

    //Comentario padre
    @ManyToOne(() => Comentario, (comentario) => comentario.respuestas, {
    nullable: true
    })

    @JoinColumn({ name: 'id_comentario_responder' })
    comentarioPadre?: Comentario;

    // RESPUESTAS
    @OneToMany(() => Comentario, (comentario) => comentario.comentarioPadre)
    respuestas?: Comentario[];
}