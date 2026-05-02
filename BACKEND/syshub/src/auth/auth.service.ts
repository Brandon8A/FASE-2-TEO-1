import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rol } from 'src/usuarios/entidades/rol.entity';
import { Usuario } from 'src/usuarios/entidades/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginDto } from './dto/login.dto/login.dto';
import * as nodemailer from 'nodemailer'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
    constructor(

        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,

        @InjectRepository(Rol)
        private rolRepository: Repository<Rol>,

        private jwtService: JwtService,
    ) { }

    async registrar(data: any) {

        const rol = await this.rolRepository.findOne({
            where: { id_rol: data.rol }
        });

        if (!rol) {
            throw new Error('El rol no existe');
        }

        const saltRounds = 10;
        const contraseñaHash = await bcrypt.hash(data.contraseña, saltRounds)

        const nuevoUsuario = this.usuarioRepository.create({
            correo: data.correo,
            contraseña: contraseñaHash,
            nombre: data.nombre,
            rol: rol,
        });

        return await this.usuarioRepository.save(nuevoUsuario);
    }

    async login(dto: LoginDto) {
        //Buscar usuario en DB
        const usuario = await this.usuarioRepository.findOne({
            where: { correo: dto.correo },
            relations: ['rol']
        });

        //Condicion para indicar que el usuario no existe
        if (!usuario) {
            throw new Error('Usuario no existe');
        }

        //Validar contraseña
        const contraseñaValida = await bcrypt.compare(
            dto.contraseña,
            usuario.contraseña
        );

        if (!contraseñaValida) {
            throw new Error('Contraseña incorrecta')
        }

        console.log('Rol: ', usuario.rol);

        return {
            message: 'Login exitoso',
            usuario: {
                correo: usuario.correo,
                rol: usuario.rol.id_rol
            }
        }
    }

    //METODO PARA RECUPERAR CONTRASEÑAS
    async recuperarPassword(correo: string) {

        //Obtener correo registrado en el sistema
        const usuario = await this.usuarioRepository.findOne({
            where: { correo }
        })

        if (!usuario) {
            throw new NotFoundException('No existe una cuenta con ese correo')
        }

        // TOKEN TEMPORAL
        const token = this.jwtService.sign(
            {
                correo: usuario.correo
            },
            {
                secret: process.env.JWT_RECOVERY_SECRET,
                expiresIn: '15m'
            }
        )

        // LINK
        const link =
            `http://localhost:5173/restablecer-password/${token}`

        // TRANSPORTER
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER, //Correo que enviara los correo de recuperacion
                pass: process.env.EMAIL_PASS,
            }
        })

        // EMAIL
        await transporter.sendMail({
            from: 'SYSHUB',
            to: correo,
            subject: 'Recuperación de contraseña',
            html: `
      <h2>Recuperación de contraseña</h2>

      <p>Presiona el siguiente botón para cambiar tu contraseña:</p>

      <a
        href="${link}"
        style="
          background:#2563eb;
          color:white;
          padding:12px 20px;
          text-decoration:none;
          border-radius:8px;
          display:inline-block;
        "
      >
        Restablecer contraseña
      </a>

      <p>Este enlace expira en 15 minutos.</p>
    `
        })

        return {
            message: 'Se envió un correo de recuperación'
        }
    }

    //Metodo para restablecer contraseña 
    async restablecerPassword(body: any) {

        try {

            const payload = this.jwtService.verify(
                body.token,
                {
                    secret: process.env.JWT_RECOVERY_SECRET
                }
            )

            const usuario = await this.usuarioRepository.findOne({
                where: {
                    correo: payload.correo
                }
            })

            if (!usuario) {
                throw new NotFoundException('Usuario no encontrado')
            }

            usuario.contraseña = await bcrypt.hash(body.nuevaPassword, 10)

            await this.usuarioRepository.save(usuario)

            return {
                message: 'Contraseña actualizada correctamente'
            }

        } catch (error) {
            throw new BadRequestException(
                'Token inválido o expirado'
            )
        }
    }
}