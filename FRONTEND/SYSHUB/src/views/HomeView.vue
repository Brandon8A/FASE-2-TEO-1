<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue';
import axios from 'axios'
import { io } from 'socket.io-client'
import ComentarioView from './comentario/ComentarioView.vue';

const socket = io('http://localhost:3000')
const isStudent = computed(() => user.value?.rol === 1);
const isAuxiliar = computed(() => user.value?.rol === 2);
const router = useRouter();
// ESTADO USUARIO
const user = ref(null)
// Estado posts
const posts = ref([])
const loading = ref(false)
const page = ref(1)
//Mensaje visual
const mensaje = ref('')
const showMensaje = ref(false)
// CONSTANTES PARA PREGUNTAS
const showPreguntaModal = ref(false)
const pregunta = ref('')
const archivoPregunta = ref(null)
//MANEJO DE ARCHIVO
const handleFilePregunta = (e) => {
  archivoPregunta.value = e.target.files[0]
}
//Constantes para comentarios
const comentarios = ref({})
const nuevoComentario = ref({})
const mostrarComentarios = ref({})

// Cargar sesión guardada
onMounted(() => {
  const savedUser = localStorage.getItem('usuario')
  if (savedUser) user.value = JSON.parse(savedUser)

  fetchPosts()
})

onMounted(() => {
  socket.on('likeActualizado', (data) => {
    console.log('Like actualizado:', data)

    const post = posts.value.find(p => p.id_publicacion === data.id)

    if (post) {
      post.likes = data.likes
    }
  })
})


// MOSTRAR MODAL PARA EL FORMULARIO DE CREAR PUBLICACION
const showModal = ref(false)

// FORMULARIO
const descripcion = ref('')
const archivo = ref(null)

// SELECCIONAR ALGUN ARCHIVO
const handleFile = (e) => {
  archivo.value = e.target.files[0]
}

// ENVIAR PUBLICACIÓN
const crearPublicacion = async () => {

  if (!verificarSesion()) return

  try {
    const formData = new FormData()

    formData.append('descripcion', descripcion.value)
    formData.append('usuario_publica_fk', user.value.correo)
    formData.append('tipo', 'POST')

    //Condicional para verificar que si se haya seleccionado un archivo
    if (archivo.value) {
      formData.append('file', archivo.value)
    }

    console.log('Metodo crearPublicacion()')

    const response = await axios.post(
      'http://localhost:3000/publicacion',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    console.log('Publicación creada:', response.data)

    // reset
    descripcion.value = ''
    archivo.value = null
    showModal.value = false

    //Actualiza el feed
    await fetchPosts()

  } catch (error) {
    console.error('Error al crear publicación', error)
  }
}

// LOGOUT
const logout = () => {
  user.value = null
  localStorage.removeItem('usuario')
}

const fetchPosts = async () => {
  if (loading.value) return

  loading.value = true

  try {
    const response = await axios.get('http://localhost:3000/publicacion')

    console.log('Publicaciones:', response.data)

    posts.value = response.data

  } catch (error) {
    console.error('Error al obtener publicaciones', error)
  }

  loading.value = false
}

// Scroll infinito
const handleScroll = (e) => {
  const el = e.target

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    fetchPosts()
  }
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

    if (post) {
      post.likes = totalLikes
    }

  } catch (error) {
    console.error('Error al dar like', error)
  }
}

//Metodo que verifica si existe sesion iniciada o no
const verificarSesion = () => {
  if (!user.value) {
    mostrarMensaje('Debes iniciar sesión para realizar esta acción')
    return false
  }
  return true
}

//Funcion para mostrar mensaje
const mostrarMensaje = (texto) => {
  mensaje.value = texto
  showMensaje.value = true

  setTimeout(() => {
    showMensaje.value = false
  }, 3000)
}

const esImagen = (archivo) => {
  return archivo?.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/)
}

const esPDF = (archivo) => {
  return archivo?.toLowerCase().endsWith('.pdf')
}

const crearPregunta = async () => {
  if (!verificarSesion()) return

  if (!pregunta.value.trim()) {
    mostrarMensaje('La pregunta no puede estar vacía')
    return
  }

  try {
    await axios.post('http://localhost:3000/publicacion', {
      descripcion: pregunta.value,
      usuario_publica_fk: user.value.correo,
      tipo: 'PREGUNTA'
    })

    // reset
    pregunta.value = ''
    showPreguntaModal.value = false

    await fetchPosts()

  } catch (error) {
    console.error('Error al crear pregunta', error)
  }
}

//Metodo para realizar un comentario en una publicacion
const comentar = async (postId, comentarioPadre = null, contenidoManual = null) => {
  if (!verificarSesion()) return

  const contenido = contenidoManual || nuevoComentario.value[postId]?.trim()

  if (!contenido) {
    mostrarMensaje('El comentario no puede estar vacío')
    return
  }

  try {
    await axios.post('http://localhost:3000/comentario', {
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
    mostrarComentarios.value[postId] = false
    return
  }

  // Si no entonces mostrar y cargar si no existen
  mostrarComentarios.value[postId] = true

  if (!comentarios.value[postId]) {
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
</script>

<template>
  <div class="bg-surface text-on-surface h-screen overflow-hidden">

    <!-- NAVBAR -->
    <nav class="bg-[#f6f3f5] sticky top-0 z-50 px-6 py-3 flex justify-between items-center">

      <span class="text-2xl font-black text-[#003366]">SYSHUB</span>

      <div class="hidden md:flex bg-white px-4 py-2 rounded-lg w-96">
        <input class="w-full outline-none text-sm" placeholder="Buscar..." />
      </div>

      <!-- LOGIN / USER -->
      <div class="flex items-center gap-4">

        <!-- NO LOGUEADO -->
        <template v-if="!user">

          <!-- BOTÓN LOGIN -->
          <button v-if="!user" @click="router.push('/login')"
            class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition">
            Iniciar sesión
          </button>

          <!-- LINK REGISTRO -->
          <button @click="router.push('/registro')" class="text-[#3a5f94] font-semibold hover:underline">
            Registrarse
          </button>

        </template>

        <!-- LOGUEADO -->
        <div v-else class="flex items-center gap-3">

          <div class="text-right hidden sm:block">
            <p class="text-xs font-bold">{{ user.correo }}</p>
            <p class="text-[10px] text-secondary uppercase">{{ user.rol }}</p>
          </div>

          <img :src="user.avatar" class="w-9 h-9 rounded-full" />

        </div>

      </div>

    </nav>

    <!-- CONTENIDO -->
    <div class="flex h-[calc(100vh-64px)]">

      <!-- SIDEBAR -->
      <aside class="hidden lg:flex flex-col justify-between w-64 p-4 pt-20 bg-[#f6f3f5] h-full">

        <!-- MENÚ -->
        <nav class="space-y-2">
          <a class="flex items-center gap-2 p-3 bg-white rounded-lg font-bold text-pink-600">
            <span class="material-symbols-outlined">home</span> Inicio
          </a>

          <a class="flex items-center gap-2 p-3 hover:bg-white rounded-lg">
            <span class="material-symbols-outlined">trending_up</span> Popular
          </a>

          <a v-if="isStudent" class="flex items-center gap-3 px-4 py-3 text-[#3a5f94] hover:bg-white rounded-lg">
            <span class="material-symbols-outlined">rocket_launch</span> PROYECTOS
          </a>

          <a class="flex items-center gap-3 px-4 py-3 text-[#3a5f94] hover:bg-white rounded-lg">
            <span class="material-symbols-outlined">help_center</span> FORO
          </a>
        </nav>

        <!-- LOGOUT ABAJO -->
        <div v-if="user" class="mt-6">
          <button @click="logout" class="w-full bg-pink-500 text-white py-2 rounded-lg hover:scale-105 transition">
            Cerrar sesión
          </button>
        </div>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 lg:ml-64 grid xl:grid-cols-12 gap-8 overflow-hidden p-6">

        <!-- FEED -->
        <div class="xl:col-span-8 overflow-y-auto h-full pr-4 space-y-6" @scroll="handleScroll">

          <h1 class="text-4xl font-bold text-secondary">
            Feed Académico
          </h1>

          <!-- POSTS -->
          <transition-group name="fade" tag="div" class="space-y-6">
            <div v-for="post in posts" :key="post.id_publicacion"
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300">
              <!-- USUARIO -->
              <p class="text-sm font-bold text-[#3a5f94]">
                {{ post.usuario?.correo }}
              </p>

              <!-- FECHA -->
              <p class="text-xs text-gray-400 mb-2">
                {{ new Date(post.fecha_publicacion).toLocaleString() }}
              </p>

              <!-- DESCRIPCIÓN -->
              <p class="text-gray-700 mb-3">
                {{ post.descripcion }}
              </p>
              <!-- MULTIMEDIA -->
              <div v-if="post.multimedia" class="mt-3">
                <!-- IMAGEN -->
                <img v-if="esImagen(post.multimedia)" :src="`http://localhost:3000/uploads/${post.multimedia}`"
                  class="rounded-lg max-h-96 w-full object-cover" />
                <!-- PDF (VISTA PREVIA REAL) -->
                <div v-else-if="esPDF(post.multimedia)" class="space-y-2">
                  <iframe :src="`http://localhost:3000/uploads/${post.multimedia}#toolbar=0`"
                    class="w-full h-96 rounded-lg border"></iframe>
                  <a :href="`http://localhost:3000/uploads/${post.multimedia}`" target="_blank"
                    class="text-sm text-blue-500 underline">
                    Abrir PDF en nueva pestaña
                  </a>
                </div>
              </div>

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
          </transition-group>

          <!-- LOADING -->
          <div v-if="loading" class="text-center py-4 text-gray-500">
            Cargando más publicaciones...
          </div>

        </div>

        <!-- PANEL DERECHO -->
        <div class="xl:col-span-4 h-full flex items-start">
          <div v-if="user" class="bg-secondary text-white p-6 rounded-xl w-full sticky top-6 space-y-3">
            <h3 class="text-xl font-bold mb-4">
              Laboratorio Académico
            </h3>

            <!-- BOTÓN GENERAL -->
            <button @click="user ? showModal = true : mostrarMensaje('Debes iniciar sesión')"
              class="w-full bg-pink-500 py-2 rounded hover:scale-105 transition">
              Crear Publicación
            </button>

            <!-- SOLO ESTUDIANTE -->
            <button v-if="isStudent" @click="user ? showPreguntaModal = true : mostrarMensaje('Debes iniciar sesión')"
              class="w-full border py-2 rounded hover:bg-white/20 transition">
              Hacer Pregunta
            </button>

            <!-- SOLO AUXILIAR -->
            <button v-if="isAuxiliar" class="w-full bg-[#3a5f94] py-2 rounded hover:scale-105 transition">
              Subir Material de Apoyo
            </button>

          </div>
        </div>

      </main>
    </div>
  </div>
  <!-- MODAL -->
  <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-[400px] space-y-4">
      <h2 class="text-xl font-bold">Nueva Publicación</h2>
      <!-- DESCRIPCIÓN -->
      <textarea v-model="descripcion" placeholder="Escribe una descripción..."
        class="w-full border p-2 rounded resize-none">
    </textarea>

      <!-- ARCHIVO -->
      <input type="file" @change="handleFile" class="w-full" />

      <!-- BOTONES -->
      <div class="flex justify-end gap-2">
        <button @click="showModal = false" class="px-4 py-2 bg-gray-300 rounded">
          Cancelar
        </button>

        <button @click="crearPublicacion" class="px-4 py-2 bg-pink-500 text-white rounded">
          Publicar
        </button>
      </div>
    </div>
  </div>
  <!-- MODAL PREGUNTA -->
  <div v-if="showPreguntaModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-xl w-[400px] space-y-4">

      <h2 class="text-xl font-bold text-[#3a5f94]">Hacer una pregunta</h2>

      <!-- SOLO TEXTO -->
      <textarea v-model="pregunta" placeholder="Escribe tu pregunta..."
        class="w-full border p-2 rounded resize-none"></textarea>

      <!-- BOTONES -->
      <div class="flex justify-end gap-2">
        <button @click="showPreguntaModal = false" class="px-4 py-2 bg-gray-300 rounded">
          Cancelar
        </button>

        <button @click="crearPregunta" class="px-4 py-2 bg-pink-500 text-white rounded hover:scale-105 transition">
          Publicar pregunta
        </button>
      </div>

    </div>
  </div>
  <div v-if="showMensaje"
    class="fixed bottom-5 right-5 bg-pink-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-bounce">
    {{ mensaje }}
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
</style>