import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm";
import { Rol } from "./rol.entity";
import { Comentario } from "src/comentario/entidades/comentario.entity";

@Entity('USUARIO')
export class Usuario {
    
    @PrimaryColumn({type: 'varchar', length: 75})
    correo!: string;

    @Column({ type: 'varchar', length: 100})
    contraseña!: string;

    @Column({ type: 'varchar', length: 75})
    nombre!: string;

    @Column({ type: 'boolean', default: false})
    suspendido!: boolean;

    @Column({ type: 'boolean', default: false})
    eliminado!: boolean;

    @ManyToOne(() => Rol, rol => rol.usuarios)
    @JoinColumn({ name: 'rol'})
    rol!: Rol;

    @OneToMany(() => Comentario, (comentario) => comentario.usuario)
    comentarios?: Comentario[];
}