import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Usuario } from "./usuario.entity";

@Entity('rol')
export class Rol {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nombre!: string;

    @OneToMany(() => Usuario, usuario => usuario.rol)
    usuarios!: Usuario[];
}