import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('TIPO_CONTENIDO')
export class TipoContenido {

    @PrimaryGeneratedColumn()
    id_tipo_contenido?: number

    @Column()
    nombre_tipo_contenido?: string
}