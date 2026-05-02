<script setup>
import { onMounted, ref, computed } from 'vue'
import router from '@/router'
import axios from 'axios'

const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

// =============================
// LOGOUT
// =============================
const logout = () => {
    localStorage.removeItem('usuario')
    router.push('/')
}

// =============================
// DATOS MODERACIÓN
// =============================
const reportes = ref([])
const cargando = ref(false)
const filtro = ref('TODOS')
const busqueda = ref('')

// =============================
// OBTENER REPORTES
// =============================
const fetchReportes = async () => {
    try {
        cargando.value = true

        const response = await axios.get(
            'http://localhost:3000/moderacion/reportes'
        )

        reportes.value = response.data

    } catch (error) {
        console.error('Error obteniendo reportes:', error)
    } finally {
        cargando.value = false
    }
}

// =============================
// FILTROS
// =============================
const reportesFiltrados = computed(() => {

    let data = reportes.value

    // filtro por estado
    if (filtro.value !== 'TODOS') {
        data = data.filter(r => r.estado === filtro.value)
    }

    // búsqueda
    if (busqueda.value.trim()) {

        const texto = busqueda.value.toLowerCase()

        data = data.filter(r =>
            r.usuario?.nombre?.toLowerCase().includes(texto) ||
            r.motivo?.toLowerCase().includes(texto) ||
            r.publicacion?.descripcion?.toLowerCase().includes(texto)
        )
    }

    return data
})

// =============================
// APROBAR REPORTE
// =============================
const aprobarReporte = async (reporte) => {

    try {

        await axios.patch(
            `http://localhost:3000/moderacion/${reporte.id}/aprobar`
        )

        reporte.estado = 'APROBADO'

    } catch (error) {
        console.error('Error al aprobar:', error)
    }
}

// =============================
// RECHAZAR REPORTE
// =============================
const rechazarReporte = async (reporte) => {

    try {

        await axios.patch(
            `http://localhost:3000/moderacion/${reporte.id}/rechazar`
        )

        reporte.estado = 'RECHAZADO'

    } catch (error) {
        console.error('Error al rechazar:', error)
    }
}

// =============================
// ELIMINAR PUBLICACIÓN
// =============================
const eliminarPublicacion = async (reporte) => {

    const confirmar = confirm(
        '¿Seguro que deseas eliminar esta publicación?'
    )

    if (!confirmar) return

    try {

        await axios.delete(
            `http://localhost:3000/publicacion/${reporte.publicacion.id}`
        )

        reporte.publicacion.eliminado = true

        alert('Publicación eliminada')

    } catch (error) {
        console.error('Error al eliminar publicación:', error)
    }
}

// =============================
// MOUNT
// =============================
onMounted(() => {
    fetchReportes()
})
</script>

<template>
    <div class="min-h-screen bg-gray-50">

        <div class="flex">

            <!-- CONTENIDO -->
            <main class="flex-1 p-8">

                <!-- HEADER -->
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                    <div>
                        <h2 class="text-3xl font-bold text-gray-800">
                            Moderación del Sistema
                        </h2>

                        <p class="text-gray-500">
                            Gestiona reportes y contenido inapropiado
                        </p>
                    </div>
                </div>

                <!-- FILTROS -->
                <div class="flex gap-3 mb-6 flex-wrap">

                    <button @click="filtro = 'TODOS'" :class="[
                        'px-4 py-2 rounded-lg border',
                        filtro === 'TODOS'
                            ? 'bg-pink-600 text-white'
                            : 'bg-white'
                    ]">

                        Todos
                    </button>

                    <button @click="filtro = 'PENDIENTE'" :class="[
                        'px-4 py-2 rounded-lg border',
                        filtro === 'PENDIENTE'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white'
                    ]">

                        Pendientes
                    </button>

                    <button @click="filtro = 'APROBADO'" :class="[
                        'px-4 py-2 rounded-lg border',
                        filtro === 'APROBADO'
                            ? 'bg-green-600 text-white'
                            : 'bg-white'
                    ]">

                        Aprobados
                    </button>

                    <button @click="filtro = 'RECHAZADO'" :class="[
                        'px-4 py-2 rounded-lg border',
                        filtro === 'RECHAZADO'
                            ? 'bg-red-600 text-white'
                            : 'bg-white'
                    ]">

                        Rechazados
                    </button>
                </div>

                <!-- LOADING -->
                <div v-if="cargando" class="text-center py-20 text-gray-500">

                    Cargando reportes...
                </div>

                <!-- SIN DATOS -->
                <div v-else-if="reportesFiltrados.length === 0" class="bg-white rounded-2xl p-10 text-center shadow">

                    <span class="material-symbols-outlined text-6xl text-gray-300">
                        verified
                    </span>

                    <p class="mt-4 text-gray-500">
                        No existen reportes actualmente
                    </p>
                </div>

                <!-- LISTADO -->
                <div v-else class="space-y-6">

                    <div v-for="reporte in reportesFiltrados" :key="reporte.id"
                        class="bg-white rounded-2xl shadow p-6 border">

                        <!-- TOP -->
                        <div class="flex justify-between items-start gap-4">

                            <div>

                                <div class="flex items-center gap-2 mb-2">

                                    <span class="font-bold text-lg">
                                        {{ reporte.usuario?.nombre }}
                                    </span>

                                    <span class="text-xs px-3 py-1 rounded-full" :class="{
                                        'bg-yellow-100 text-yellow-700': reporte.estado === 'PENDIENTE',
                                        'bg-green-100 text-green-700': reporte.estado === 'APROBADO',
                                        'bg-red-100 text-red-700': reporte.estado === 'RECHAZADO'
                                    }">

                                        {{ reporte.estado }}
                                    </span>
                                </div>

                                <p class="text-sm text-gray-500">
                                    {{ reporte.usuario?.correo }}
                                </p>
                            </div>

                            <span class="text-sm text-gray-400">
                                {{ reporte.fecha }}
                            </span>
                        </div>

                        <!-- MOTIVO -->
                        <div class="mt-5">

                            <h4 class="font-semibold text-gray-700 mb-2">
                                Motivo del reporte
                            </h4>

                            <p class="bg-gray-100 rounded-xl p-4 text-gray-700">
                                {{ reporte.motivo }}
                            </p>
                        </div>

                        <!-- PUBLICACIÓN -->
                        <div class="mt-5">

                            <h4 class="font-semibold text-gray-700 mb-2">
                                Publicación reportada
                            </h4>

                            <div class="bg-gray-50 border rounded-xl p-4">

                                <p class="text-gray-800">
                                    {{ reporte.publicacion?.descripcion }}
                                </p>

                                <!-- MULTIMEDIA -->
                                <div v-if="reporte.publicacion?.multimedia" class="mt-4">

                                    <a :href="reporte.publicacion.multimedia" target="_blank"
                                        class="text-blue-600 hover:underline">

                                        Ver archivo adjunto
                                    </a>
                                </div>

                                <!-- ELIMINADA -->
                                <div v-if="reporte.publicacion?.eliminado" class="mt-3 text-red-600 font-semibold">

                                    Publicación eliminada
                                </div>
                            </div>
                        </div>

                        <!-- ACCIONES -->
                        <div class="flex flex-wrap gap-3 mt-6">

                            <button @click="aprobarReporte(reporte)"
                                class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">

                                Aprobar
                            </button>

                            <button @click="rechazarReporte(reporte)"
                                class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">

                                Rechazar
                            </button>

                            <button @click="eliminarPublicacion(reporte)"
                                class="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg">

                                Eliminar publicación
                            </button>
                        </div>

                    </div>
                </div>

            </main>
        </div>
    </div>
</template>