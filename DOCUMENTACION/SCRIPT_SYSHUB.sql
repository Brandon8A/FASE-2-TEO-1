CREATE DATABASE SYSHUB;

USE SYSHUB;

CREATE TABLE ROL( id_rol INT AUTO_INCREMENT PRIMARY KEY, nombre_rol VARCHAR(255) NOT NULL);

CREATE TABLE USUARIO( correo VARCHAR(75) PRIMARY KEY, contraseña VARCHAR(100) NOT NULL, nombre VARCHAR(75) NOT NULL, suspendido BOOLEAN DEFAULT FALSE, eliminado BOOLEAN DEFAULT FALSE, rol int NOT NULL, FOREIGN KEY(rol) REFERENCES ROL(id_rol));

CREATE TABLE LIKES( id INT AUTO_INCREMENT PRIMARY KEY, usuarioCorreo VARCHAR(75) NOT NULL, publicacionIdPublicacion INT);

CREATE TABLE TIPO_CONTENIDO( id_tipo_contenido INT AUTO_INCREMENT PRIMARY KEY, nombre_tipo_contenido VARCHAR(255) NOT NULL);

INSERT INTO TIPO_CONTENIDO(nombre_tipo_contenido) VALUES ('PENSUM'), ('CATEGORIA'), ('AREA TECNICA');

CREATE TABLE CONTENIDO( id_contenido INT AUTO_INCREMENT PRIMARY KEY, nombre_contenido VARCHAR(255) NOT NULL, tipo_contenido INT NOT NULL, FOREIGN KEY(tipo_contenido) REFERENCES TIPO_CONTENIDO(id_tipo_contenido));

CREATE TABLE PROYECTO( id_proyecto INT AUTO_INCREMENT PRIMARY KEY, descripcion VARCHAR(250) NOT NULL, stack VARCHAR(400) NOT NULL, etiquetas VARCHAR(150) NOT
NULL, path_archivo VARCHAR(150) NOT NULL, id_usuario_proyecto VARCHAR(75) NOT NULL, FOREIGN KEY(id_usuario_proyecto) REFERENCES USUARIO(correo));

CREATE TABLE DESTACADO( id_curaduria INT AUTO_INCREMENT PRIMARY KEY, path_guias VARCHAR(150), path_grabaciones VARCHAR(150), path_material VARCHAR(150), id_usuario_destaca_fk VARCHAR(75), id_proyecto_fk INT NOT NULL, FOREIGN KEY(id_usuario_destaca_fk) REFERENCES USUARIO(correo), FOREIGN KEY(id_proyecto_fk) REFERENCES PROYECTO(id_proyecto));

CREATE TABLE PUBLICACION( id_publicacion INT AUTO_INCREMENT PRIMARY KEY, fecha_publicacion DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6) NOT NULL, likes INT DEFAULT 0, usuario_publica_fk VARCHAR(75) NOT NULL, multimedia VARCHAR(100), descripcion VARCHAR(100) NOT NULL, tipo ENUM('POST', 'PREGUNTA') DEFAULT 'POST', FOREIGN KEY(usuario_publica_fk) REFERENCES USUARIO(correo));

CREATE TABLE COMENTARIO( id_comentario INT AUTO_INCREMENT PRIMARY KEY, contenido VARCHAR(200) NOT NULL, id_comentario_responder INT, usuario_comentar_fk VARCHAR(75), id_publicacion_fk INT, FOREIGN KEY(usuario_comentar_fk) REFERENCES USUARIO(correo), FOREIGN KEY(id_publicacion_fk) REFERENCES PUBLICACION(id_publicacion), FOREIGN KEY(id_comentario_responder) REFERENCES COMENTARIO(id_comentario));

CREATE TABLE BLOG_ARTICULO( id_blog_articulo INT AUTO_INCREMENT PRIMARY KEY, path_multimedia VARCHAR(200), texto VARCHAR(2500), id_usuario_publica_fk VARCHAR(75) NOT NULL, FOREIGN KEY(id_usuario_publica_fk) REFERENCES USUARIO(correo));
