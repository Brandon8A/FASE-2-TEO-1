import { IsInt, IsOptional, IsString } from "class-validator";

export class CrearComentarioDto {

    @IsString()
    contenido?: string;

    @IsString()
    usuario_comentar_fk?: string;

    @IsInt()
    id_publicacion_fk?: number;

    @IsOptional()
    @IsInt()
    id_comentario_responder?: number;

}
