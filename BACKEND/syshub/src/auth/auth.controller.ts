import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto/crear-usuario.dto';
import { LoginDto } from './dto/login.dto/login.dto';

//Controlador de autenticación
@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) {

    }

    //Metodo post para registrar usuario
    @Post('register')
    async register(@Body() dto: CrearUsuarioDto) {

        const usuario = await this.authService.registrar(dto);

        return {
            message: 'Usuario registrado correctamente',
            data: usuario
        };
    }

    @Post('login')
    async logueo(@Body() dto: LoginDto) {
        console.log('DTO recibido: ', dto)

        const resultado = await this.authService.login(dto);

        console.log('Respuesta enviada: ', resultado)

        return resultado;
    }

    //Metodo post para recuperacion de contraseña
    @Post('recuperar-password')
    async recuperarPassword(@Body('correo') correo: string) {
        return this.authService.recuperarPassword(correo)
    }

    //Metodo para restablecer contraseña
    @Post('restablecer-password')
    async restablecerPassword(
        @Body() body: any
    ) {
        return this.authService.restablecerPassword(body)
    }
}