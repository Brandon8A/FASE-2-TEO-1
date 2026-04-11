import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Rol } from "./rol.entity";

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
}