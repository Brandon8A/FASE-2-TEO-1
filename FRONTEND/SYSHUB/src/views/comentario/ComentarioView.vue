<script setup>
import { ref } from 'vue'
import ComentarioView from './ComentarioView.vue'

const props = defineProps({
    comentario: Object,
    postId: Number,
    comentar: Function
})

const mostrarRespuesta = ref(false)
const respuesta = ref('')
</script>

<template>
    <div class="mt-2">

        <div class="bg-gray-100 p-3 rounded-lg">
            <p class="text-xs font-bold text-[#3a5f94]">
                {{ comentario.usuario?.correo }}
            </p>

            <p class="text-sm">
                {{ comentario.contenido }}
            </p>

            <button @click="mostrarRespuesta = !mostrarRespuesta" class="text-xs text-blue-500 mt-1">
                Responder
            </button>

            <div v-if="mostrarRespuesta" class="mt-2 flex gap-2">
                <input v-model="respuesta" placeholder="Responder..." class="flex-1 border p-1 rounded text-sm" />

                <button @click="() => {
                    comentar(postId, comentario.id_comentario, respuesta)
                    respuesta = ''
                    mostrarRespuesta = false
                }" class="text-xs bg-blue-500 text-white px-2 rounded">
                    Enviar
                </button>
            </div>
        </div>

        <div v-if="comentario.respuestas?.length" class="ml-6 border-l pl-3">
            <ComentarioView v-for="resp in comentario.respuestas" :key="resp.id_comentario" :comentario="resp"
                :postId="postId" :comentar="comentar" />
        </div>

    </div>
</template>