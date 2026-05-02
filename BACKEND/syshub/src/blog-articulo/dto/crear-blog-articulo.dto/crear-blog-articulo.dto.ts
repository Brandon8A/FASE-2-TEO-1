import { IsOptional, IsString } from 'class-validator'

export class CrearBlogArticuloDto {
    @IsOptional()
    @IsString()
    path_multimedia?: string

    @IsString()
    texto!: string

    @IsString()
    id_usuario_publica_fk!: string
}