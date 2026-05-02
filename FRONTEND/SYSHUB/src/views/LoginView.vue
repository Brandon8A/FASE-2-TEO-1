<script setup>
import router from '@/router'
import axios from 'axios'
import { ref } from 'vue'

// Estados
const correo = ref('')
const contraseña = ref('')

const mostrarModalRecuperacion = ref(false)
const correoRecuperacion = ref('')
const mensajeRecuperacion = ref('')
const loadingRecuperacion = ref(false)

const enviarCorreoRecuperacion = async () => {

  try {

    loadingRecuperacion.value = true
    mensajeRecuperacion.value = ''

    const response = await axios.post(
      'http://localhost:3000/auth/recuperar-password',
      {
        correo: correoRecuperacion.value
      }
    )

    mensajeRecuperacion.value = response.data.message

  } catch (error) {

    mensajeRecuperacion.value =
      error.response?.data?.message || 'Error al enviar correo'

  } finally {
    loadingRecuperacion.value = false
  }
}

// Acción login 
const handleLogin = async () => {

  // console.log("Login:", correo.value, contraseña.value)

  try {

    const response = await axios.post('http://localhost:3000/auth/login', {
      correo: correo.value,
      contraseña: contraseña.value
    })

    //console.log('Login ok: ', response.data)

    const usuario = response.data.usuario

    console.log('Usuario logueado:', usuario)

    localStorage.setItem('usuario', JSON.stringify(usuario))

    //console.log('Rol', usuario.rol)
    //Redireccionar por rol
    if (Number(usuario.rol) === 3) {
      router.push('/homeAdmin')
    } else {
      router.push('/')
    }

  } catch (error) {
    alert('Hubo un error al iniciar sesion')
    console.error('Error login: ', error.response?.data || error.message)
  }
}
</script>

<template>
  <div class="bg-surface text-on-surface min-h-screen flex flex-col font-[Manrope]">

    <!-- MAIN -->
    <main class="flex-grow flex items-center justify-center px-6 py-12">

      <div class="w-full max-w-[440px] flex flex-col gap-10">

        <!-- LOGO -->
        <div class="text-center space-y-2">
          <h1 class="text-4xl font-extrabold tracking-tighter text-secondary">
            SYSHUB
          </h1>
        </div>

        <!-- CARD -->
        <div
          class="bg-surface-container-lowest rounded-xl p-8 md:p-10 shadow-[0_12px_32px_rgba(27,27,29,0.04)] relative overflow-hidden">

          <!-- EFECTO -->
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-surface-tint opacity-5 blur-[80px] rounded-full"></div>

          <form @submit.prevent="handleLogin" class="space-y-6 relative z-10">

            <!-- EMAIL -->
            <div class="space-y-2">
              <label class="block text-xs font-bold uppercase tracking-widest text-surface-tint px-1">
                Correo Institucional
              </label>

              <input v-model="correo" type="email" placeholder="ejemplo202700000@cunoc.edu.gt"
                class="w-full bg-surface-container-highest rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-surface-tint transition-all outline-none" />
            </div>

            <!-- PASSWORD -->
            <div class="space-y-2">

              <div class="flex justify-between items-end px-1">
                <label class="text-xs font-bold uppercase tracking-widest text-surface-tint">
                  Contraseña
                </label>

                <button type="button" @click="mostrarModalRecuperacion = true"
                  class="text-[12px] font-semibold text-secondary hover:text-surface-tint">
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              <input v-model="contraseña" type="password" placeholder="contraseña"
                class="w-full bg-surface-container-highest rounded-lg py-4 px-4 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-2 focus:ring-surface-tint transition-all outline-none" />
            </div>

            <!-- BOTÓN -->
            <button type="submit"
              class="w-full bg-surface-tint text-white py-4 px-6 rounded-lg font-bold text-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>Iniciar Sesión</span>
              <span class="material-symbols-outlined text-[20px]">login</span>
            </button>

          </form>
        </div>

        <!-- FOOTER -->
        <div class="text-center space-y-4">

          <p class="text-on-surface-variant font-medium">
            ¿No tienes una cuenta?
            <a href="/registro" class="text-surface-tint font-bold hover:underline ml-1">
              Regístrate
            </a>
          </p>

          <div class="flex items-center justify-center gap-6 pt-4">
            <div class="h-[1px] w-12 bg-outline-variant/20"></div>
            <div class="h-[1px] w-12 bg-outline-variant/20"></div>
          </div>

        </div>

      </div>
    </main>

    <!-- MODAL RECUPERACIÓN -->
    <div v-if="mostrarModalRecuperacion" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">

      <div class="bg-white w-full max-w-md rounded-2xl p-8 relative">

        <!-- CERRAR -->
        <button @click="mostrarModalRecuperacion = false" class="absolute top-4 right-4 text-gray-500 hover:text-black">
          ✕
        </button>

        <div class="space-y-6">

          <div>
            <h2 class="text-2xl font-bold text-gray-800">
              Recuperar contraseña
            </h2>

            <p class="text-gray-500 mt-2 text-sm">
              Ingresa tu correo institucional y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <!-- INPUT -->
          <div class="space-y-2">

            <label class="text-sm font-semibold text-gray-700">
              Correo institucional
            </label>

            <input v-model="correoRecuperacion" type="email" placeholder="ejemplo202700000@cunoc.edu.gt"
              class="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <!-- MENSAJE -->
          <p v-if="mensajeRecuperacion" class="text-sm text-center text-blue-600 font-medium">
            {{ mensajeRecuperacion }}
          </p>

          <!-- BOTÓN -->
          <button @click="enviarCorreoRecuperacion" :disabled="loadingRecuperacion"
            class="w-full bg-surface-tint text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
            {{ loadingRecuperacion ? 'Enviando...' : 'Enviar enlace' }}
          </button>

        </div>

      </div>

    </div>

    <!-- FONDOS -->
    <div
      class="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-surface-container-high rounded-full blur-[120px] -z-10 opacity-30">
    </div>
    <div
      class="fixed bottom-[-5%] left-[20%] w-[30%] h-[30%] bg-primary-fixed rounded-full blur-[100px] -z-10 opacity-20">
    </div>

  </div>
</template>

<style>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400;
}
</style>