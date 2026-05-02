import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from 'typeorm'

import { Usuario } from 'src/usuarios/entidades/usuario.entity'

@Entity('BLOG_ARTICULO')
export class BlogArticulo {

  @PrimaryGeneratedColumn()
  id_blog_articulo!: number

  @Column({
    type: 'varchar',
    length: 200,
    nullable: true
  })
  path_multimedia?: string | null

  @Column({
    type: 'varchar',
    length: 2500
  })
  texto!: string

  // RELACION CON USUARIO
  @ManyToOne(
    () => Usuario,
    usuario => usuario.blogs
  )
  @JoinColumn({
    name: 'id_usuario_publica_fk'
  })
  usuario!: Usuario

}