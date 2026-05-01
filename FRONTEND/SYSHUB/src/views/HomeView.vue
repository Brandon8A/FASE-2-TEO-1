<script setup>
import axios from 'axios'
import { ref, onMounted, computed, provide, watch } from 'vue'
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

const showDestacarModal = ref(false)
// CAMPOS FORMULARIO
const estudianteSeleccionado = ref('')
const proyectoSeleccionado = ref('')
// LISTA DE ESTUDIANTES
const estudiantes = ref([])

// LISTA DE PROYECTOS DEL ESTUDIANTE
const proyectosEstudiante = ref([])

// SELECCIONAR ALGUN ARCHIVO
const handleFile = (e) => {
  archivo.value = e.target.files[0]
}

// OBTENER ESTUDIANTES
const obtenerEstudiantes = async () => {
  try {
    const response = await axios.get('http://localhost:3000/usuarios/estudiantes')

    estudiantes.value = response.data

  } catch (error) {
    console.error('Error al obtener estudiantes', error)
  }
}
// OBTENER PROYECTOS DEL ESTUDIANTE
const obtenerProyectosEstudiante = async (correo) => {

  if (!correo) {
    proyectosEstudiante.value = []
    return
  }

  try {

    const response = await axios.get(
      `http://localhost:3000/proyecto/usuario/${correo}`
    )

    proyectosEstudiante.value = response.data

  } catch (error) {
    console.error('Error al obtener proyectos', error)
  }
}

// WATCH PARA CAMBIAR ESTUDIANTE
watch(estudianteSeleccionado, (nuevoCorreo) => {

  proyectoSeleccionado.value = ''
  obtenerProyectosEstudiante(nuevoCorreo)

})

// CREAR DESTACADO
const destacarProyecto = async () => {

  if (!proyectoSeleccionado.value) {
    mostrarMensaje('Debes seleccionar un proyecto')
    return
  }

  try {

    const formData = new FormData()

    formData.append('proyecto_fk', proyectoSeleccionado.value)
    formData.append('usuario_auxiliar_fk', user.value.correo)

    // ARCHIVO OPCIONAL
    if (archivoAdjunto.value) {
      formData.append('archivo', archivoAdjunto.value)
    }

    // VIDEO OPCIONAL
    if (videoAdjunto.value) {
      formData.append('video', videoAdjunto.value)
    }

    // ENLACE OPCIONAL
    if (enlaceProyecto.value.trim()) {
      formData.append('enlace', enlaceProyecto.value)
    }

    await axios.post(
      'http://localhost:3000/destacar-proyecto',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    mostrarMensaje('Proyecto destacado correctamente')

    // RESET
    estudianteSeleccionado.value = ''
    proyectoSeleccionado.value = ''
    archivoAdjunto.value = null
    videoAdjunto.value = null
    enlaceProyecto.value = ''

    proyectosEstudiante.value = []

    showDestacarModal.value = false

  } catch (error) {
    console.error('Error al destacar proyecto', error)
    mostrarMensaje('Error al destacar proyecto')
  }

}


// Cargar usuario
onMounted(() => {
  const savedUser = localStorage.getItem('usuario')

  if (savedUser) {
    user.value = JSON.parse(savedUser)
  }

  // OBTENER ESTUDIANTES
  obtenerEstudiantes()
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
            <!-- BOTÓN DESTACAR -->
            <button v-if="isAuxiliar" @click="showDestacarModal = true"
              class="w-full bg-[#3a5f94] py-2 rounded hover:scale-105 transition">
              Destacar Proyecto
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


  <!-- MODAL DESTACAR PROYECTO -->
  <div v-if="showDestacarModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div class="bg-white p-6 rounded-2xl w-[500px] space-y-5 shadow-2xl">

      <!-- TITULO -->
      <div>
        <h2 class="text-2xl font-bold text-[#3a5f94]">
          Destacar Proyecto
        </h2>

        <p class="text-sm text-gray-500 mt-1">
          Selecciona un estudiante y uno de sus proyectos.
        </p>
      </div>

      <!-- ESTUDIANTE -->
      <div class="space-y-2">

        <label class="text-sm font-semibold text-gray-700">
          Estudiante
        </label>

        <select v-model="estudianteSeleccionado"
          class="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400">

          <option value="">
            Selecciona un estudiante
          </option>

          <option v-for="estudiante in estudiantes" :key="estudiante.correo" :value="estudiante.correo">
            {{ estudiante.nombre }} - {{ estudiante.correo }}
          </option>

        </select>

      </div>

      <!-- PROYECTO -->
      <div class="space-y-2">

        <label class="text-sm font-semibold text-gray-700">
          Proyecto
        </label>

        <select v-model="proyectoSeleccionado" :disabled="!estudianteSeleccionado"
          class="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:bg-gray-100">

          <option value="">
            Selecciona un proyecto
          </option>

          <option v-for="proyecto in proyectosEstudiante" :key="proyecto.id_proyecto" :value="proyecto.id_proyecto">
            {{ proyecto.titulo }}
          </option>

        </select>

      </div>

      <!-- ARCHIVO OPCIONAL -->
      <div class="space-y-2">

        <label class="text-sm font-semibold text-gray-700">
          Archivo adicional (Opcional)
        </label>

        <input type="file" @change="handleArchivoAdjunto" class="w-full border border-gray-300 p-2 rounded-xl" />

      </div>

      <!-- VIDEO OPCIONAL -->
      <div class="space-y-2">

        <label class="text-sm font-semibold text-gray-700">
          Video (Opcional)
        </label>

        <input type="file" accept="video/*" @change="handleVideoAdjunto"
          class="w-full border border-gray-300 p-2 rounded-xl" />

      </div>

      <!-- ENLACE OPCIONAL -->
      <div class="space-y-2">

        <label class="text-sm font-semibold text-gray-700">
          Enlace (Opcional)
        </label>

        <input v-model="enlaceProyecto" type="text" placeholder="https://..."
          class="w-full border border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400" />

      </div>

      <!-- BOTONES -->
      <div class="flex justify-end gap-3 pt-2">

        <button @click="showDestacarModal = false"
          class="px-5 py-2 rounded-xl bg-gray-300 hover:bg-gray-400 transition">
          Cancelar
        </button>

        <button @click="destacarProyecto"
          class="px-5 py-2 rounded-xl bg-pink-500 text-white hover:scale-105 transition">
          Destacar
        </button>

      </div>

    </div>

  </div>
</template>