<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import axios from 'axios'
import { io } from 'socket.io-client'
import ComentarioView from '../comentario/ComentarioView.vue'

// SOCKET
const socket = io('http://localhost:3000')

const recargarFeed = inject('recargarFeed')

// USUARIO
const user = ref(null)

// POSTS
const posts = ref([])
const loading = ref(false)

// MENSAJE
const mensaje = ref('')
const showMensaje = ref(false)

// MODAL PUBLICACIÓN
const showModal = ref(false)
const descripcion = ref('')
const archivo = ref(null)

// PREGUNTA
const showPreguntaModal = ref(false)
const pregunta = ref('')

// COMENTARIOS
const comentarios = ref({})
const nuevoComentario = ref({})
const mostrarComentarios = ref({})

// INIT
onMounted(() => {
    const savedUser = localStorage.getItem('usuario')
    if (savedUser) user.value = JSON.parse(savedUser)

    fetchPosts()
})

onMounted(() => {
    socket.on('likeActualizado', (data) => {
        const post = posts.value.find(p => p.id_publicacion === data.id)
        if (post) post.likes = data.likes
    })
})

//Recargar feed desde otro "componente"
watch(recargarFeed, () => {
    fetchPosts()
})

// PUBLICACIONES
const fetchPosts = async () => {
    if (loading.value) return

    loading.value = true

    try {
        const res = await axios.get('http://localhost:3000/publicacion')
        posts.value = res.data
    } catch (error) {
        console.error(error)
    }

    loading.value = false
}

const handleFile = (e) => {
    archivo.value = e.target.files[0]
}

//Metodo para dar like a una publicacion
const darLike = async (id) => {
    if (!verificarSesion()) return
    try {
        const response = await axios.post(
            `http://localhost:3000/publicacion/${id}/like`,
            {
                correo: user.value.correo
            }

        )
        const { totalLikes } = response.data
        //ACTUALIZACIÓN LOCAL INMEDIATA
        const post = posts.value.find(p => p.id_publicacion === id)
        if (post) { post.likes = totalLikes }
    } catch (error) {
        console.error('Error al dar like', error)
    }
}

//Metodo para realizar un comentario en una publicacion
const comentar = async (postId, comentarioPadre = null,
    contenidoManual = null) => {
    if (!verificarSesion()) return
    const contenido = contenidoManual ||
        nuevoComentario.value[postId]?.trim()
    if (!contenido) {
        mostrarMensaje('El comentario no puede estar vacío')
        return
    }
    try {
        await axios.post('http://localhost:3000/comentario',
            {
                contenido,
                usuario_comentar_fk: user.value.correo,
                id_publicacion_fk: postId,
                id_comentario_responder: comentarioPadre
            })

        nuevoComentario.value[postId] = ''
        await cargarComentarios(postId)
    } catch (error) {
        console.error('Error al comentar', error)
    }
}

const cargarComentarios = async (postId) => {

    console.log('Metodo cargarComentarios')

    try {
        const res = await axios.get(`http://localhost:3000/comentario/publicacion/${postId}`)
        console.log(res.data)
        comentarios.value[postId] = construirArbolComentarios(res.data)
    } catch (error) {
        console.error('Error al cargar comentarios', error)
    }
}

const toggleComentarios = async (postId) => {
    // Si ya están visibles entonces ocultar 
    if (mostrarComentarios.value[postId]) {
        console.log('Ocultar comentarios')
        mostrarComentarios.value[postId] = false
        return
    }
    // Si no entonces mostrar y cargar si no existen
    mostrarComentarios.value[postId] = true
    if (!comentarios.value[postId]) {
        console.log('Mostrar comentarios')
        await cargarComentarios(postId)
    }
}

//Comentarios anidados
const construirArbolComentarios = (lista) => {
    const mapa = {}
    const raiz = []
    // Crear mapa
    lista.forEach(c => {
        mapa[c.id_comentario] = { ...c, respuestas: [] }
    })

    // Construir árbol 
    lista.forEach(c => {
        if (c.comentarioPadre) {
            const padreId = c.comentarioPadre.id_comentario
            mapa[padreId]?.respuestas.push(mapa[c.id_comentario])
        } else {
            raiz.push(mapa[c.id_comentario])
        }
    })
    return raiz
}

// UTILS
const verificarSesion = () => {
    if (!user.value) {
        mostrarMensaje('Debes iniciar sesión')
        return false
    }
    return true
}

const mostrarMensaje = (texto) => {
    mensaje.value = texto
    showMensaje.value = true

    setTimeout(() => showMensaje.value = false, 3000)
}

const esImagen = (archivo) => {
    return archivo?.toLowerCase()?.match(/\.(jpg|jpeg|png|gif|webp)$/)
}
const esPDF = (archivo) => {
    return archivo?.toLowerCase()?.endsWith('.pdf')
}
</script>

<template>
    <div class="space-y-6">

        <h1 class="text-4xl font-bold text-secondary">
            Feed Académico
        </h1>

        <!-- POSTS -->
        <div v-for="post in posts" :key="post.id_publicacion" class="bg-white p-6 rounded-xl shadow">

            <p class="text-sm font-bold">
                {{ post.usuario?.correo }}
            </p>

            <p class="text-xs text-gray-400">
                {{ new Date(post.fecha_publicacion).toLocaleString() }}
            </p>

            <p class="mt-2">
                {{ post.descripcion }}
            </p>

            <!-- MULTIMEDIA -->
            <img v-if="esImagen(post.multimedia)" :src="`http://localhost:3000/uploads/${post.multimedia}`"
                class="mt-3 rounded-lg" />

            <iframe v-else-if="esPDF(post.multimedia)" :src="`http://localhost:3000/uploads/${post.multimedia}`"
                class="w-full h-64 mt-3"></iframe>

            <!-- ACCIONES -->
            <div class="flex items-center gap-4 mt-2">
                <!-- LIKE -->
                <button @click="darLike(post.id_publicacion)" class="transition"
                    :class="user ? 'text-pink-500 hover:scale-110' : 'text-gray-400 cursor-not-allowed'">
                    ❤️ {{ post.likes }}
                </button>
                <!-- COMENTARIOS -->
                <button @click="toggleComentarios(post.id_publicacion)"
                    class="text-blue-500 hover:scale-110 transition">
                    💬 Comentarios
                </button>
            </div>

            <!-- BLOQUE DE COMENTARIOS -->
            <div v-if="mostrarComentarios[post.id_publicacion]" class="mt-4">

                <!-- LISTA ANIDADA -->
                <ComentarioView v-for="comentario in comentarios[post.id_publicacion]" :key="comentario.id_comentario"
                    :comentario="comentario" :postId="post.id_publicacion" :user="user" :comentar="comentar" />

                <!-- NUEVO COMENTARIO -->
                <div class="mt-3 flex gap-2">
                    <input v-model="nuevoComentario[post.id_publicacion]" placeholder="Escribe un comentario..."
                        class="flex-1 border p-2 rounded" />

                    <button @click="comentar(post.id_publicacion)" class="bg-pink-500 text-white px-3 rounded">
                        Comentar
                    </button>
                </div>

            </div>

        </div>

        <!-- MENSAJE -->
        <div v-if="showMensaje" class="fixed bottom-5 right-5 bg-pink-500 text-white px-4 py-2 rounded">
            {{ mensaje }}
        </div>

    </div>
</template>