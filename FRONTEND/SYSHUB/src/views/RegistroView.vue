<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import axios from 'axios'

const router = useRouter()

const form = ref({
  rol: 'estudiante',
  nombre: '',
  correo: '',
  contraseña: ''
})

const handleRegister = async () => {
  try {
    console.log('Datos del formulario: ')
    console.log(form.value)
    const response = await axios.post('http://localhost:3000/auth/register', form.value)

    console.log('Respuesta backend:', response.data)

    // Redirigir después de registrar
    router.push('/login')

  } catch (error) {
    console.error('Error al registrar:', error.response?.data || error.message)
  }
}
</script>

<template>
  <div class="bg-surface font-body text-on-surface min-h-screen antialiased">

    <!-- NAVBAR LIMPIO -->
    <nav class="fixed top-0 z-50 w-full bg-[#fcf8fb]/80 backdrop-blur-md">
      <div class="flex justify-center items-center w-full px-6 py-4 max-w-7xl mx-auto">
        <div class="text-xl font-extrabold tracking-tighter text-[#3a5f94]">
          SYSHUB
        </div>
      </div>
    </nav>

    <!-- CONTENIDO -->
    <main class="min-h-screen pt-24 pb-12 flex items-center justify-center px-4">

      <div class="max-w-2xl w-full">

        <div class="bg-surface-container-lowest rounded-[2rem] p-8 lg:p-12 shadow-[0_12px_32px_rgba(27,27,29,0.04)] border border-outline-variant/10">

          <form @submit.prevent="handleRegister" class="space-y-8">

            <!-- ROLES -->
            <div class="space-y-4">
              <label class="block text-sm font-bold text-secondary uppercase tracking-widest px-1">
                Selecciona tu Rol
              </label>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

                <!-- ESTUDIANTE -->
                <label class="relative cursor-pointer group">
                  <input v-model="form.rol" :value=1 type="radio" class="peer sr-only" />

                  <div class="p-6 bg-surface-container-low rounded-2xl border-2 border-transparent 
                              peer-checked:border-surface-tint peer-checked:bg-white transition-all hover:bg-surface-container">

                    <div class="mb-4 text-secondary group-hover:scale-110 transition">
                      <span class="material-symbols-outlined text-3xl">school</span>
                    </div>

                    <h3 class="font-bold text-secondary">Estudiante</h3>
                    <p class="text-[10px] text-on-surface-variant">
                      Acceso a cursos y recursos.
                    </p>
                  </div>
                </label>

                <!-- AUXILIAR -->
                <label class="relative cursor-pointer group">
                  <input v-model="form.rol" :value=2 type="radio" class="peer sr-only" />

                  <div class="p-6 bg-surface-container-low rounded-2xl border-2 border-transparent 
                              peer-checked:border-surface-tint peer-checked:bg-white transition-all hover:bg-surface-container">

                    <div class="mb-4 text-secondary group-hover:scale-110 transition">
                      <span class="material-symbols-outlined text-3xl">edit_note</span>
                    </div>

                    <h3 class="font-bold text-secondary">Auxiliar</h3>
                    <p class="text-[10px] text-on-surface-variant">
                      Apoyo docente.
                    </p>
                  </div>
                </label>

                <!-- ADMIN -->
                <label class="relative cursor-pointer group">
                  <input v-model="form.rol" :value=3 type="radio" class="peer sr-only" />

                  <div class="p-6 bg-surface-container-low rounded-2xl border-2 border-transparent 
                              peer-checked:border-surface-tint peer-checked:bg-white transition-all hover:bg-surface-container">

                    <div class="mb-4 text-secondary group-hover:scale-110 transition">
                      <span class="material-symbols-outlined text-3xl">admin_panel_settings</span>
                    </div>

                    <h3 class="font-bold text-secondary">Administrador</h3>
                    <p class="text-[10px] text-on-surface-variant">
                      Control total del sistema.
                    </p>
                  </div>
                </label>

              </div>
            </div>

            <!-- INPUTS -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div class="md:col-span-2 space-y-2">
                <label class="text-sm font-semibold text-secondary ml-1">
                  Nombre Completo
                </label>
                <input
                  v-model="form.nombre"
                  type="text"
                  class="w-full px-6 py-4 bg-surface-container-highest rounded-xl focus:ring-2 focus:ring-surface-tint"
                  placeholder="Nombre"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary ml-1">
                  Email
                </label>
                <input
                  v-model="form.correo"
                  type="email"
                  class="w-full px-6 py-4 bg-surface-container-highest rounded-xl focus:ring-2 focus:ring-surface-tint"
                  placeholder="202700000@cunoc.edu.gt"
                />
              </div>

              <div class="space-y-2">
                <label class="text-sm font-semibold text-secondary ml-1">
                  Contraseña
                </label>
                <input
                  v-model="form.contraseña"
                  type="password"
                  class="w-full px-6 py-4 bg-surface-container-highest rounded-xl focus:ring-2 focus:ring-surface-tint"
                  placeholder="Contraseña"
                />
              </div>

            </div>

            <!-- BOTÓN -->
            <div class="flex flex-col md:flex-row items-center gap-6 pt-4">

              <button
                type="submit"
                class="w-full md:w-auto px-10 py-4 bg-surface-tint text-white font-extrabold rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition"
              >
                Crear Cuenta
              </button>

              <div class="text-sm text-on-surface-variant">
                ¿Ya tienes una cuenta?
                <a
                  @click.prevent="router.push('/login')"
                  class="text-secondary font-bold hover:text-surface-tint cursor-pointer ml-1">
                  Iniciar sesión
                </a>
              </div>

            </div>

          </form>

        </div>

      </div>

    </main>

  </div>
</template>