import { Comentario } from 'src/comentario/entidades/comentario.entity';
import { Likes } from 'src/likes/entidades/likes.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity('PUBLICACION')
export class Publicacion {

  @PrimaryGeneratedColumn()
  id_publicacion?: number;

  @CreateDateColumn({ type: 'datetime' })
  fecha_publicacion?: Date;

  @Column({ default: 0 })
  likes?: number;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_publica_fk'})
  usuario?: Usuario;

  @Column({ length: 100, nullable: true })
  multimedia?: string;

  @Column({ length: 100 })
  descripcion?: string;

  @Column({
    type: 'enum',
    enum: ['POST', 'PREGUNTA'],
    default: 'POST'
  })
  tipo?: 'POST' | 'PREGUNTA'

  @OneToMany(() => Likes, like => like.publicacion)
  likesRelacion?: Likes[]

  @OneToMany(() => Comentario, (comentario) => comentario.publicacion)
  comentarios?: Comentario[];
}