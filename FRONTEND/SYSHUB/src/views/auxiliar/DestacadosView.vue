<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const destacados = ref([])

const obtenerDestacados = async () => {
    try {

        const response = await axios.get(
            'http://localhost:3000/proyecto/destacados'
        )

        destacados.value = response.data

    } catch (error) {
        console.error('Error al obtener destacados', error)
    }
}

onMounted(() => {
    obtenerDestacados()
})
</script>

<template>

    <div class="space-y-6">

        <div>
            <h1 class="text-3xl font-bold text-[#3a5f94]">
                Proyectos Destacados
            </h1>

            <p class="text-gray-500">
                Proyectos seleccionados por auxiliares.
            </p>
        </div>

        <!-- CARDS -->
        <div v-for="destacado in destacados" :key="destacado.id_destacado"
            class="bg-white rounded-2xl shadow p-5 space-y-4">

            <div class="flex justify-between items-center">

                <div>
                    <h2 class="text-xl font-bold">
                        {{ destacado.proyecto?.titulo }}
                    </h2>

                    <p class="text-sm text-gray-500">
                        {{ destacado.proyecto?.usuario?.nombre }}
                    </p>
                </div>

                <span class="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-bold">
                    DESTACADO
                </span>

            </div>

            <p class="text-gray-700">
                {{ destacado.proyecto?.descripcion }}
            </p>

            <!-- STACK -->
            <div class="flex flex-wrap gap-2">

                <span v-for="stack in destacado.proyecto?.stack?.split(',')" :key="stack"
                    class="bg-[#3a5f94]/10 text-[#3a5f94] px-3 py-1 rounded-full text-sm">
                    {{ stack }}
                </span>

            </div>

            <!-- ENLACE -->
            <a v-if="destacado.enlace" :href="destacado.enlace" target="_blank"
                class="text-pink-500 font-semibold hover:underline">
                Ver proyecto
            </a>

        </div>

    </div>

</template>