import { IsInt, IsOptional, IsString } from "class-validator";
import { CrearUsuarioDto } from "../crear-usuario.dto/crear-usuario.dto";

export class ActualizarUsuarioDto {
    @IsOptional()
    @IsString()
    nombre?: string;

    @IsOptional()
    @IsString()
    contraseña?: string;

    @IsOptional()
    @IsInt()
    rol?: number;
}