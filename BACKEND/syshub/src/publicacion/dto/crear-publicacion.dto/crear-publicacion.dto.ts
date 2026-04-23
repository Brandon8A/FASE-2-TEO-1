import { IsOptional, IsString } from "class-validator";

export class CrearPublicacionDto {
    @IsString()
    descripcion?: string

    @IsString()
    usuario_publica_fk?: string

    @IsOptional()
    multimedia?: string
}
