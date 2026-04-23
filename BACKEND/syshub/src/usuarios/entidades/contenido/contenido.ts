import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { TipoContenido } from "../tipo-contenido/tipo-contenido";

@Entity('CONTENIDO')
export class Contenido {

    @PrimaryGeneratedColumn()
    id_contenido?: number

    @Column()
    nombre_contenido?: string

    @Column()
    tipo_contenido?: number

    @ManyToOne(() => TipoContenido)
    @JoinColumn({ name: 'tipo_contenido' })
    tipo?: TipoContenido
}
