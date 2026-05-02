<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const destacados = ref([])
const user = ref(null)

const obtenerDestacados = async () => {

    try {

        const response = await axios.get(
            `http://localhost:3000/proyecto/destacados/${user.value.correo}`
        )

        destacados.value = response.data

    } catch (error) {
        console.error('Error al obtener destacados', error)
    }

}

onMounted(() => {

    const savedUser = localStorage.getItem('usuario')

    if (savedUser) {
        user.value = JSON.parse(savedUser)
    }

    obtenerDestacados()

})
</script>

<template>

    <div class="space-y-6">

        <div>
            <h1 class="text-3xl font-bold text-[#3a5f94]">
                Mis Proyectos Destacados
            </h1>

            <p class="text-gray-500">
                Proyectos destacados por ti.
            </p>
        </div>

        <!-- VACÍO -->
        <div v-if="destacados.length === 0" class="bg-white rounded-2xl p-10 text-center shadow">

            <p class="text-gray-500">
                No has destacado proyectos todavía.
            </p>

        </div>

        <!-- CARDS -->
        <div v-for="destacado in destacados" :key="destacado.id_destacado"
            class="bg-white rounded-2xl shadow p-5 space-y-4">

            <!-- HEADER -->
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

            <!-- DESCRIPCIÓN -->
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