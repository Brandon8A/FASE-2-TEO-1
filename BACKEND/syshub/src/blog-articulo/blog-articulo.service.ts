import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogArticulo } from './entidades/blog-articulo.entity';
import { Repository } from 'typeorm';
import { CrearBlogArticuloDto } from './dto/crear-blog-articulo.dto/crear-blog-articulo.dto';

@Injectable()
export class BlogArticuloService {
    constructor(
        @InjectRepository(BlogArticulo)
        private readonly blogRepository: Repository<BlogArticulo>
    ) {
    }

    // CREAR BLOG 
    async crearBlog(dto: CrearBlogArticuloDto, file?: Express.Multer.File) {
        const nuevoBlog = this.blogRepository.create({
            texto: dto.texto,
            usuario: {
                correo: dto.id_usuario_publica_fk
            },
            path_multimedia: file ? `uploads/blogs-articulos/${file.filename}` : null
        })
        return await this.blogRepository.save(nuevoBlog)
    }

    // OBTENER BLOGS DEL USUARIO 
    async obtenerBlogsUsuario(correo: string) {
        return await this.blogRepository.find({
            where: {
                usuario: {
                    correo
                }
            },
            relations: ['usuario'],
            order: {
                id_blog_articulo: 'DESC'
            }
        })
    }
}