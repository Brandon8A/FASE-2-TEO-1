<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const token = route.params.token

const nuevaPassword = ref('')
const mensaje = ref('')

const cambiarPassword = async () => {

    try {

        const response = await axios.post(
            'http://localhost:3000/auth/restablecer-password',
            {
                token,
                nuevaPassword: nuevaPassword.value
            }
        )

        mensaje.value = response.data.message

        setTimeout(() => {
            router.push('/login')
        }, 2000)

    } catch (error) {

        mensaje.value =
            error.response?.data?.message || 'Error'

    }
}
</script>
<template>

    <div class="min-h-screen flex items-center justify-center bg-gray-100">

        <div class="bg-white p-8 rounded-2xl shadow w-full max-w-md space-y-6">

            <h1 class="text-2xl font-bold text-center">
                Nueva contraseña
            </h1>

            <input v-model="nuevaPassword" type="password" placeholder="Nueva contraseña"
                class="w-full border rounded-lg px-4 py-3" />

            <button @click="cambiarPassword" class="w-full bg-blue-600 text-white py-3 rounded-lg">
                Cambiar contraseña
            </button>

            <p class="text-center text-sm text-blue-600">
                {{ mensaje }}
            </p>

        </div>

    </div>

</template>