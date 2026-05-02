<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const blogs = ref([])
const user = ref(null)
const showModalBlog = ref(false)
const textoBlog = ref('')
const archivoBlog = ref(null)
const mensaje = ref('')
const showMensaje = ref(false)
// OBTENER USUARIO 
onMounted(() => {
    const savedUser = localStorage.getItem('usuario')
    if (savedUser) {
        user.value = JSON.parse(savedUser)
        obtenerBlogsUsuario()
    }
})
// MENSAJE 
const mostrarMensaje = (texto) => {
    mensaje.value = texto
    showMensaje.value = true
    setTimeout(() => {
        showMensaje.value = false
    },
        3000)
}
// ARCHIVO 
const handleArchivoBlog = (e) => {
    archivoBlog.value = e.target.files[0]
}
// OBTENER BLOGS DEL USUARIO 
const obtenerBlogsUsuario = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/blog-articulo/usuario/${user.value.correo}`)
        blogs.value = response.data
    } catch (error) {
        console.error('Error al obtener blogs', error)
    }
}
// CREAR BLOG 
const crearBlog = async () => {
    if (!textoBlog.value.trim()) {
        mostrarMensaje('La descripción es obligatoria')
        return
    }
    try {
        const formData = new FormData()
        formData.append('texto', textoBlog.value)
        formData.append('id_usuario_publica_fk', user.value.correo)
        // ARCHIVO OPCIONAL 
        if (archivoBlog.value) {
            formData.append('file', archivoBlog.value)
        }
        await axios.post('http://localhost:3000/blog-articulo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        mostrarMensaje('Blog creado correctamente')
        // RESET 
        textoBlog.value = ''
        archivoBlog.value = null
        showModalBlog.value = false
        alert('Blog/Articulo creado correctamente')
        // RECARGAR BLOGS 
        obtenerBlogsUsuario()
    } catch (error) {
        console.error('Error al crear blog', error)
        mostrarMensaje('Error al crear blog')
    }
}
// OBTENER NOMBRE ARCHIVO 
const obtenerNombreArchivo = (path) => {
    if (!path) return ''
    return path.split('/').pop()
}
</script>

<template>
    <div class="space-y-6"> <!-- HEADER -->
        <div class="flex justify-between items-center">
            <div>
                <h1 class="text-3xl font-bold text-[#3a5f94]"> Blogs y Artículos </h1>
                <p class="text-gray-500 mt-1"> Administra tus publicaciones académicas. </p>
            </div> <!-- BOTON --> <button @click="showModalBlog = true"
                class="bg-pink-500 text-white px-5 py-3 rounded-xl hover:scale-105 transition"> + Nuevo Blog </button>
        </div> <!-- LISTA -->
        <div v-if="blogs.length > 0" class="grid gap-5">
            <div v-for="blog in blogs" :key="blog.id_blog_articulo"
                class="bg-white rounded-2xl shadow-md p-6 border border-gray-100"> <!-- TEXTO -->
                <p class="text-gray-700 whitespace-pre-line"> {{ blog.texto }} </p> <!-- ARCHIVO -->
                <div v-if="blog.path_multimedia" class="mt-4 bg-gray-100 p-3 rounded-xl flex items-center gap-3"> <span
                        class="material-symbols-outlined text-[#3a5f94]"> attach_file </span> <a
                        :href="`http://localhost:3000/${blog.path_multimedia}`" target="_blank"
                        class="text-blue-600 hover:underline"> {{ obtenerNombreArchivo(blog.path_multimedia) }} </a>
                </div> <!-- FOOTER -->
                <div class="mt-4 text-xs text-gray-400"> Blog #{{ blog.id_blog_articulo }} </div>
            </div>
        </div> <!-- SIN BLOGS -->
        <div v-else class="bg-white rounded-2xl p-10 text-center shadow"> <span
                class="material-symbols-outlined text-6xl text-gray-300"> article </span>
            <h2 class="text-xl font-bold text-gray-600 mt-4"> No has creado blogs todavía </h2>
            <p class="text-gray-400 mt-2"> Crea tu primer blog o artículo académico. </p>
        </div>
    </div> <!-- MODAL -->
    <div v-if="showModalBlog" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white w-[500px] rounded-2xl p-6 space-y-5 shadow-2xl"> <!-- TITULO -->
            <div>
                <h2 class="text-2xl font-bold text-[#3a5f94]"> Nuevo Blog / Artículo </h2>
                <p class="text-sm text-gray-500 mt-1"> Comparte contenido académico con otros usuarios. </p>
            </div> <!-- DESCRIPCION -->
            <div class="space-y-2"> <label class="font-semibold text-gray-700"> Descripción </label> <textarea
                    v-model="textoBlog" placeholder="Escribe el contenido del blog..." rows="7"
                    class="w-full border border-gray-300 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"></textarea>
            </div> <!-- ARCHIVO -->
            <div class="space-y-2"> <label class="font-semibold text-gray-700"> Archivo multimedia (Opcional) </label>
                <input type="file" @change="handleArchivoBlog" class="w-full border border-gray-300 rounded-xl p-2" />
            </div> <!-- BOTONES -->
            <div class="flex justify-end gap-3"> <button @click="showModalBlog = false"
                    class="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition"> Cancelar </button> <button
                    @click="crearBlog" class="px-5 py-2 rounded-xl bg-pink-500 text-white hover:scale-105 transition">
                    Publicar </button> </div>
        </div>
    </div> <!-- MENSAJE -->
    <div v-if="showMensaje" class="fixed bottom-5 right-5 bg-pink-500 text-white px-4 py-2 rounded-xl"> {{ mensaje }}
    </div>
</template>