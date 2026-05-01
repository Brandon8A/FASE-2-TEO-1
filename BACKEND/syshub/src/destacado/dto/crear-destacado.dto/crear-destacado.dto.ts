import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CrearDestacadoDto {

    @IsString()
    usuario_auxiliar_fk!: string;

    @Type(() => Number)
    @IsInt()
    proyecto_fk!: number;

    @IsOptional()
    @IsString()
    enlace?: string;

}