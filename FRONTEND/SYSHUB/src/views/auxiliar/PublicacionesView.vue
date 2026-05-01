<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import axios from 'axios'

const publicaciones = ref([])

const recargarFeed = inject('recargarFeed')

const obtenerPublicaciones = async () => {

    try {

        const response = await axios.get(
            'http://localhost:3000/publicacion'
        )

        publicaciones.value = response.data

    } catch (error) {
        console.error('Error al obtener publicaciones', error)
    }

}

onMounted(() => {
    obtenerPublicaciones()
})

watch(recargarFeed, () => {
    obtenerPublicaciones()
})
</script>

<template>

    <div class="space-y-5">

        <div>
            <h1 class="text-3xl font-bold text-[#3a5f94]">
                Publicaciones
            </h1>

            <p class="text-gray-500">
                Feed de publicaciones del laboratorio.
            </p>
        </div>

        <!-- CARD -->
        <div v-for="publicacion in publicaciones" :key="publicacion.id_publicacion"
            class="bg-white p-5 rounded-2xl shadow">

            <div class="flex items-center justify-between mb-3">

                <div>
                    <h3 class="font-bold">
                        {{ publicacion.usuario?.nombre }}
                    </h3>

                    <p class="text-xs text-gray-400">
                        {{ publicacion.usuario?.correo }}
                    </p>
                </div>

                <span class="bg-[#3a5f94]/10 text-[#3a5f94] px-3 py-1 rounded-full text-xs">
                    {{ publicacion.tipo }}
                </span>

            </div>

            <p class="text-gray-700 whitespace-pre-line">
                {{ publicacion.descripcion }}
            </p>

            <!-- ARCHIVO -->
            <div v-if="publicacion.multimedia" class="mt-4">

                <a :href="`http://localhost:3000/uploads/${publicacion.multimedia}`" target="_blank"
                    class="text-pink-500 hover:underline">
                    Ver archivo adjunto
                </a>

            </div>

        </div>

    </div>

</template>