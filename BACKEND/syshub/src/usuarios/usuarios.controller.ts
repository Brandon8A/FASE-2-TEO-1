import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { ActualizarUsuarioDto } from 'src/auth/dto/actualizar-usuario.dto/actualizar-usuario.dto';

@Controller('usuarios')
export class UsuariosController {

    constructor(private usuarioService: UsuariosService){

    }

    @Get()
    obtenerUsuarios(){
        //console.log('Controlador usuarios')
        return this.usuarioService.obtenerUsuariosNoEliminados()
    }

    @Patch(':correo/suspender')
    suspenderUsuario(
        @Param('correo') correo: string, @Body() body: { suspendido: boolean }
    ){
        return this.usuarioService.actualizarEstado(correo, body.suspendido);
    }

    @Patch(':correo/eliminar')
    eliminarUsuario(@Param('correo') correo: string){
        return this.usuarioService.eliminar(correo);
    }

    @Patch(':correo/actualizar')
    actualizarUsuario(
        @Param('correo') correo: string,
        @Body() data: ActualizarUsuarioDto
    ){
        return this.usuarioService.actualizar(correo, data)
    }
}