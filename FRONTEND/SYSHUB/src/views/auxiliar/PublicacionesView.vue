<script setup>
import { ref, onMounted, inject, watch } from 'vue'
import axios from 'axios'

const publicaciones = ref([])
const user = ref(null)

const recargarFeed = inject('recargarFeed')

const obtenerPublicaciones = async () => {

    try {

        const response = await axios.get(
            `http://localhost:3000/publicacion/usuario/${user.value.correo}`
        )

        publicaciones.value = response.data

    } catch (error) {
        console.error('Error al obtener publicaciones', error)
    }

}

onMounted(() => {

    const savedUser = localStorage.getItem('usuario')

    if (savedUser) {
        user.value = JSON.parse(savedUser)
    }

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
                Mis Publicaciones
            </h1>

            <p class="text-gray-500">
                Publicaciones realizadas por ti.
            </p>
        </div>

        <!-- VACÍO -->
        <div v-if="publicaciones.length === 0" class="bg-white p-10 rounded-2xl shadow text-center">

            <p class="text-gray-500">
                No has realizado publicaciones.
            </p>

        </div>

        <!-- CARD -->
        <div v-for="publicacion in publicaciones" :key="publicacion.id_publicacion"
            class="bg-white p-5 rounded-2xl shadow">

            <!-- HEADER -->
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

            <!-- DESCRIPCIÓN -->
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