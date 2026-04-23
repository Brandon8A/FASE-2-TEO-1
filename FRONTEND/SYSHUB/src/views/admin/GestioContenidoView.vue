<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const pensums = ref([])
const categorias = ref([])
const areas = ref([])
const mostrarModal = ref(false)
const tipoSeleccionado = ref(null)
const nombreContenido = ref('')

const TIPOS = {
  PENSUM: 1,
  CATEGORIA: 2,
  AREA: 3
}

const abrirModal = (tipo) => {
  tipoSeleccionado.value = tipo
  nombreContenido.value = ''
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
}

const guardarContenido = async () => {
  try {

    await axios.post('http://localhost:3000/admin/contenido', {
      nombre_contenido: nombreContenido.value,
      tipo_contenido: tipoSeleccionado.value
    })

    cerrarModal()
    obtenerDatos() // 🔥 refresca la vista

  } catch (error) {
    console.error('Error al guardar:', error)
  }
}

const obtenerDatos = async () => {
  try {

    console.log('Entrando a metodo obtenerDatos()')
    const response = await axios.get('http://localhost:3000/admin/contenido')

    pensums.value = response.data.pensums
    categorias.value = response.data.categorias
    areas.value = response.data.areas

  } catch (error) {
    console.error('Error al obtener datos:', error)
  }
}

onMounted(() => {
  obtenerDatos()
})
</script>

<template>
  <div class="bg-surface-container-low min-h-screen p-8 md:p-12 lg:p-16">

    <div class="max-w-7xl mx-auto space-y-10">

      <!-- HEADER -->
      <header class="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div class="space-y-2">
          <span class="text-surface-tint font-bold tracking-widest text-xs uppercase">
            Administración de Recursos
          </span>

          <h1 class="text-secondary text-4xl lg:text-5xl font-extrabold tracking-tight">
            Organización de Contenido
          </h1>

          <p class="text-on-surface-variant text-lg max-w-2xl">
            Gestione la estructura académica y categorización del sistema.
          </p>
        </div>
      </header>

      <!-- GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

        <!-- PENSUM -->
        <section class="bg-white rounded-xl p-6 shadow">
          <h2 class="font-bold text-xl text-secondary mb-4">PENSUM</h2>

          <div class="space-y-3">
            <div v-for="pensum in pensums" :key="pensum.id_contenido" class="p-4 bg-gray-50 rounded-lg">
              <h3 class="font-bold">{{ pensum.nombre_contenido }}</h3>
            </div>
          </div>

          <button 
            @click="abrirModal(TIPOS.PENSUM)"
            class="mt-4 w-full bg-pink-600 text-white py-2 rounded">
              + Añadir Pensum
          </button>
        </section>

        <!-- CATEGORÍAS -->
        <section class="bg-white rounded-xl p-6 shadow">
          <h2 class="font-bold text-xl text-secondary mb-4">CATEGORÍAS</h2>

          <div class="space-y-3">
            <div v-for="categoria in categorias" :key="categoria.id_contenido" class="p-3 border-b">
              <h3 class="font-bold">{{ categoria.nombre_contenido }}</h3>
            </div>
          </div>

          <button 
            @click="abrirModal(TIPOS.CATEGORIA)"
            class="mt-4 w-full border py-2 rounded">
              + Añadir Categoría
          </button>
        </section>

        <!-- ÁREAS -->
        <section class="bg-white rounded-xl p-6 shadow">
          <h2 class="font-bold text-xl text-secondary mb-4">ÁREAS TÉCNICAS</h2>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="area in areas" :key="area.id_contenido" class="px-3 py-1 bg-gray-200 rounded-full">
                {{ area.nombre_contenido }}
              </span>
            </div>
          <button 
            @click="abrirModal(TIPOS.AREA)"
            class="mt-4 border px-3 py-1 rounded">
              + Añadir
          </button>
        </section>

      </div>

    </div>

  </div>
  <div v-if="mostrarModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

  <div class="bg-white p-6 rounded-xl w-96 space-y-4">

    <h2 class="text-xl font-bold">
      Nuevo contenido
    </h2>

    <input
      v-model="nombreContenido"
      type="text"
      placeholder="Nombre del contenido"
      class="w-full border p-2 rounded"
    />

    <div class="flex justify-end gap-2">
      <button @click="cerrarModal" class="px-4 py-2 border rounded">
        Cancelar
      </button>

      <button @click="guardarContenido" class="px-4 py-2 bg-pink-600 text-white rounded">
        Guardar
      </button>
    </div>

  </div>

</div>
</template>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400;
}
</style>