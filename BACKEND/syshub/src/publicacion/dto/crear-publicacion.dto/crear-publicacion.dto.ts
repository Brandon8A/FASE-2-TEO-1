import { IsIn, IsOptional, IsString } from "class-validator";

export class CrearPublicacionDto {
    @IsString()
    descripcion!: string //Requerido

    @IsString()
    usuario_publica_fk!: string //Requerido

    @IsOptional()
    multimedia?: string

    @IsString()
    @IsIn(['POST', 'PREGUNTA'])//Valida valores permitidos
    tipo?: 'POST' | 'PREGUNTA'
}