import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginDto {

    @IsEmail()
    correo!: string;
    
    @IsNotEmpty()
    contraseña!: string;
}
