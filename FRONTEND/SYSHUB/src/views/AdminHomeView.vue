<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'

import axios from 'axios'

const usuarios = ref([])

const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

//Metodo para cerrar sesión y redirigir a pagina principal
const logout = () => {
  localStorage.removeItem('usuario')
  router.push('/')
}

// MODAL
const showModal = ref(false)
const isEditing = ref(false)

const form = ref({
  nombre: '',
  correo: '',
  contraseña: '',
  rol: 'Estudiante',
  estado: 'Activo'
})

// EDITAR O GUARDAR NUEVO USUARIO POR ADMINISTRADOR
const guardarUsuario = async () => {
  try {

    // Validación básica
    if (!form.value.nombre || !form.value.correo) {
      alert('Nombre y correo son obligatorios')
      return
    }

    // Solo obligatoria al crear
    if (!isEditing.value && !form.value.contraseña) {
      alert('La contraseña es obligatoria')
      return
    }

    const rolMap = {
      'Estudiante': 1,
      'Auxiliar': 2,
      'Administrador': 3
    }

    const data = {
      nombre: form.value.nombre,
      rol: rolMap[form.value.rol],
      contraseña: form.value.contraseña || undefined
    }

    //Condicional para editar usuario
    if (isEditing.value) {

      await axios.patch(
        `http://localhost:3000/usuarios/${form.value.correo}/actualizar`,
        data
      )

      // actualizar en tabla
      const index = usuarios.value.findIndex(u => u.correo === form.value.correo)

      if (index !== -1) {
        usuarios.value[index].nombre = form.value.nombre
        usuarios.value[index].rol = form.value.rol
      }

    } else {

      await axios.post(
        'http://localhost:3000/auth/register',
        {
          ...data,
          correo: form.value.correo
        }
      )

      usuarios.value.push({
        nombre: form.value.nombre,
        correo: form.value.correo,
        rol: form.value.rol,
        estado: 'Activo'
      })
    }

    showModal.value = false

  } catch (error) {
    console.error('Error al guardar:', error.response?.data || error.message)
  }
}
</script>

<template>
  <div class="min-h-screen bg-background">

    <!-- NAVBAR LIMPIO -->
    <header class="sticky top-0 bg-white shadow px-10 py-4 flex justify-between">
      <h1 class="text-2xl font-bold text-blue-700">SYSHUB</h1>
      <div class="flex items-center gap-4">
        <div class="text-right">
          <p class="text-sm font-bold">{{ usuarioActual.correo }}</p>
        </div>

        <!-- BOTÓN LOGOUT -->
        <button @click="logout" class="bg-pink-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition">
          Cerrar sesión
        </button>
      </div>
    </header>

    <div class="flex">

      <!-- SIDEBAR -->
      <aside class="hidden lg:flex flex-col w-64 p-6 gap-4">

        <!-- USUARIOS -->
        <router-link to="/homeAdmin/usuarios" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-pink-100 text-pink-600">
          <span class="material-symbols-outlined">manage_accounts</span>
          Usuarios
        </router-link>

        <!-- CONTENIDO -->
        <router-link to="/homeAdmin/contenido" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          exact-active-class="bg-pink-100 text-pink-600">
          <span class="material-symbols-outlined">account_tree</span>
          Contenido
        </router-link>

        <router-link to="/homeAdmin/moderacion" class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
          active-class="bg-pink-100 text-pink-600">
          <span class="material-symbols-outlined">gavel</span>
          Moderación
        </router-link>
      </aside>

      <!-- MAIN -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>

    <!-- MODAL -->
    <div v-if="showModal" class="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div class="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h3 class="font-bold text-lg">
          {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>

        <input v-model="form.nombre" placeholder="Nombre" class="w-full border p-2 rounded" />
        <input v-model="form.correo" placeholder="Correo"
          class="w-full border p-2 rounded disabled:bg-gray-200 disabled:cursor-not-allowed" :disabled="isEditing" />
        <input v-model="form.contraseña" type="password" placeholder="Contraseña" class="w-full border p-2 rounded" />

        <select v-model="form.rol" class="w-full border p-2 rounded">
          <option>Estudiante</option>
          <option>Auxiliar</option>
          <option>Administrador</option>
        </select>





        <div class="flex justify-end gap-2">
          <button @click="showModal = false">Cancelar</button>
          <button @click="guardarUsuario" class="bg-pink-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>