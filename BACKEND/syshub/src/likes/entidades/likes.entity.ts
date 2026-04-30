import { Publicacion } from "src/publicacion/entidades/publicacion.entity";
import { Usuario } from "src/usuarios/entidades/usuario.entity";
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from "typeorm";

@Entity('LIKES')
@Unique(['usuario', 'publicacion'])//Esto evita duplicados
export class Likes{

    @PrimaryGeneratedColumn()
    id?: number;

    @ManyToOne(() => Usuario)
    @JoinColumn({ name: 'usuarioCorreo' })
    usuario?: Usuario

    @ManyToOne(() => Publicacion, pub => pub.likesRelacion)
    @JoinColumn({ name: 'publicacionIdPublicacion' })
    publicacion?: Publicacion
}