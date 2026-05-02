import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from 'src/auth/dto/actualizar-usuario.dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {

    constructor(private usuarioService: UsuariosService){

    }

    //Metodo get que obtiene usuarios no eliminados registrados en el sistema
    @Get()
    obtenerUsuarios(){
        //console.log('Controlador usuarios')
        return this.usuarioService.obtenerUsuariosNoEliminados()
    }

    //Metodo patch para suspender un usuario
    @Patch(':correo/suspender')
    suspenderUsuario(
        @Param('correo') correo: string, @Body() body: { suspendido: boolean }
    ){
        return this.usuarioService.actualizarEstado(correo, body.suspendido);
    }

    //Metodo patch para eliminar un usuario
    @Patch(':correo/eliminar')
    eliminarUsuario(@Param('correo') correo: string){
        return this.usuarioService.eliminar(correo);
    }

    //Metodo patch para actualizar un usuario(suspender-activar)
    @Patch(':correo/actualizar')
    actualizarUsuario(
        @Param('correo') correo: string,
        @Body() data: ActualizarUsuarioDto
    ){
        return this.usuarioService.actualizar(correo, data)
    }

    //Metodo get para obtener usuario solo con rol ESTUDIANTE
    @Get('estudiantes')
    obtenerEstudiantes(){
        return this.usuarioService.obtenerEstudiantes();
    }
}