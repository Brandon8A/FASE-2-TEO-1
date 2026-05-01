import { IsString } from 'class-validator'

export class CrearProyectoDto {

    @IsString()
    titulo?: string

    @IsString()
    descripcion?: string

    @IsString()
    stack?: string

    @IsString()
    etiquetas?: string

    @IsString()
    id_usuario_proyecto?: string
}