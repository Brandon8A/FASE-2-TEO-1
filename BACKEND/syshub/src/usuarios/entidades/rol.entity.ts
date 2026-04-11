import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity('ROL')
export class Rol {
    @PrimaryGeneratedColumn({ name: 'id_rol' })
    id_rol!: number;

    @Column({ name: 'nombre_rol' })
    nombre!: string;

    @OneToMany(() => Usuario, usuario => usuario.rol)
    usuarios!: Usuario[];
}