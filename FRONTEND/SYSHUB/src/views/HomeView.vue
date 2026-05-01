<script setup>
import axios from 'axios'
import { ref, onMounted, computed, provide } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Usuario
const user = ref(null)

const isStudent = computed(() => user.value?.rol === 1)
const isAuxiliar = computed(() => user.value?.rol === 2)

// UI
const showMensaje = ref(false)
const mensaje = ref('')
//Recargar feed
const recargarFeed = ref(0)
provide('recargarFeed', recargarFeed)

// MOSTRAR MODAL PARA EL FORMULARIO DE CREAR PUBLICACION
const showModal = ref(false)
// CONSTANTES PARA PREGUNTAS
const showPreguntaModal = ref(false)
const pregunta = ref('')
const archivoPregunta = ref(null)
//Constantes para formulario Publicacion
const descripcion = ref('')
const archivo = ref(null)

// SELECCIONAR ALGUN ARCHIVO
const handleFile = (e) => {
  archivo.value = e.target.files[0]
}


// Cargar usuario
onMounted(() => {
  const savedUser = localStorage.getItem('usuario')

  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }
})

// Logout
const logout = () => {
  user.value = null
  localStorage.removeItem('usuario')

  router.push('/login')
}

//Metodo que verifica si existe sesion iniciada o no
const verificarSesion = () => {
  if (!user.value) {
    mostrarMensaje('Debes iniciar sesión para realizar esta acción')
    return false
  }
  return true
}

//Metodo para crear una nueva publicacion
const crearPublicacion = async () => {

  console.log('Metodo crearPublicacion()')
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

    //Recargar el feed
    recargarFeed.value++

  } catch (error) {
    console.error('Error al crear publicación', error)
  }

}

//Metodo para crear una pregunta
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

    //Recargar el feed
    recargarFeed.value++

  } catch (error) {
    console.error('Error al crear pregunta', error)
  }
}


// MENSAJE
const mostrarMensaje = (texto) => {
  mensaje.value = texto
  showMensaje.value = true

  setTimeout(() => {
    showMensaje.value = false
  }, 3000)
}
</script>

<template>
  <div class="bg-surface text-on-surface h-screen overflow-hidden">

    <!-- NAVBAR -->
    <nav class="bg-[#f6f3f5] sticky top-0 z-50 px-6 py-3 flex justify-between items-center">

      <span class="text-2xl font-black text-[#003366]">
        SYSHUB
      </span>

      <!-- LOGIN -->
      <div class="flex items-center gap-4">

        <template v-if="!user">

          <button @click="router.push('/login')" class="bg-pink-500 text-white px-4 py-2 rounded-lg">
            Iniciar sesión
          </button>

          <button @click="router.push('/registro')" class="text-[#3a5f94] font-semibold">
            Registrarse
          </button>

        </template>

        <!-- USER -->
        <div v-else class="flex items-center gap-3">

          <p class="text-xs font-bold">
            {{ user.correo }}
          </p>

        </div>

      </div>

    </nav>

    <!-- CONTENIDO -->
    <div class="flex h-[calc(100vh-64px)]">

      <!-- SIDEBAR -->
      <aside class="hidden lg:flex flex-col justify-between w-64 p-4 pt-10 bg-[#f6f3f5]">

        <nav class="space-y-2">

          <!-- INICIO -->
          <router-link to="/feed" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white"
            active-class="bg-pink-100 text-pink-600">
            🏠 Inicio
          </router-link>

          <!-- PROYECTOS -->
          <router-link v-if="isStudent" to="/proyectos" class="flex items-center gap-3 p-3 rounded-lg hover:bg-white"
            active-class="bg-pink-100 text-pink-600">
            🚀 Proyectos
          </router-link>

        </nav>

        <!-- LOGOUT -->
        <button v-if="user" @click="logout" class="bg-pink-500 text-white py-2 rounded-lg">
          Cerrar sesión
        </button>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 lg:ml-64 grid xl:grid-cols-12 gap-6 p-6 overflow-hidden">

        <!-- CONTENIDO DINÁMICO -->
        <div class="xl:col-span-8 h-full overflow-y-auto">
          <router-view />
        </div>

        <!-- PANEL DERECHO -->
        <div class="xl:col-span-4">

          <div v-if="user" class="bg-[#3a5f94] text-white p-6 rounded-xl sticky top-6 space-y-4">

            <h3 class="text-xl font-bold">
              Laboratorio Académico
            </h3>

            <!-- PUBLICACIÓN -->
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

    <!-- MODAL PUBLICACION-->
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
    <!-- MENSAJE -->
    <div v-if="showMensaje" class="fixed bottom-5 right-5 bg-pink-500 text-white px-4 py-2 rounded">
      {{ mensaje }}
    </div>

  </div>
</template>