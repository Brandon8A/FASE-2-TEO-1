<script setup>
import { onMounted, ref } from 'vue'
import router from '@/router'

import axios from 'axios'

const usuarios = ref([])

//Obtiene los usuarios una vez que se inicie la vista
onMounted(() => {
  obtenerUsuarios()
})

//Metodo para cerrar sesión y redirigir a pagina principal
const logout = () =>{
  localStorage.removeItem('user')
  router.push('/')
}

//METODO PARA OBTENER LOS USUARIOS REGISTRADOS EN EL SISTEMA
const obtenerUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3000/usuarios')//OBTENER USUARIOS DESDE CONTROLLADOR 'usuarios'

    //console.log('Usuarios desde backend:', response.data)

    //Mapear usuarios obtenidos
    usuarios.value = response.data.map(u => ({
      id: u.correo,
      nombre: u.nombre,
      correo: u.correo,
      rol: u.rol?.nombre || 'Sin rol',
      estado: u.suspendido ? 'Suspendido' : 'Activo'
    }))

  } catch (error) {
    console.error('Error al obtener usuarios:', error.response?.data || error.message)
  }
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

// ABRIR CREAR
const crearUsuario = () => {
  isEditing.value = false
  form.value = { nombre: '', correo: '', contraseña: '', rol: 'Estudiante', estado: 'Activo' }
  showModal.value = true
}

// EDITAR
const editar = (user) => {
  isEditing.value = true
  form.value = { ...user, contraseña: '' }
  showModal.value = true
}

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

// ELIMINAR USUARIO POR ADMINISTRADOR
const eliminar = async (correo) => {
  //CONFIRMAR ELIMINACION DE USUARIO
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return

  try {
    await axios.patch(`http://localhost:3000/usuarios/${correo}/eliminar`)
    usuarios.value = usuarios.value.filter(u => u.correo !== correo)
  } catch (error) {
    console.error('Error al eliminar:', error.response?.data || error.message)
  }
}

// METODO PARA CAMBIAR EL ESTADO DEL USUARIO A activo | suspendido
const toggleEstado = async (user) => {
  try {
    const nuevoEstado = user.estado === 'Activo'
    console.log('Usuario: ',user.correo)

    await axios.patch(`http://localhost:3000/usuarios/${user.correo}/suspender`, {
      suspendido: nuevoEstado
    })

    // actualizar en tabla
    user.estado = nuevoEstado ? 'Suspendido' : 'Activo'

  } catch (error) {
    console.error('Error al cambiar estado:', error.response?.data || error.message)
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
          <p class="text-sm font-bold">Admin</p>
        </div>

        <img class="w-10 h-10 rounded-full" src="https://i.pravatar.cc/100"/>

        <!-- BOTÓN LOGOUT -->
        <button @click="logout"
          class="bg-pink-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-red-600 transition">
          Cerrar sesión
        </button>
      </div>
    </header>

    <div class="flex">

      <!-- SIDEBAR -->
      <aside class="hidden lg:flex flex-col w-64 p-6 gap-6">

        <div class="flex items-center gap-3 font-bold text-pink-600">
          <span class="material-symbols-outlined">manage_accounts</span>
            Usuarios
        </div>

        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined">account_tree</span>
            Contenido
        </div>

        <div class="flex items-center gap-3">
          <span class="material-symbols-outlined">gavel</span>
            Moderación
        </div>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 p-6 space-y-6">

        <h2 class="text-3xl font-bold">
          Panel Administrador
        </h2>

        <!-- TABLA -->
        <section class="bg-white p-6 rounded-xl shadow">

          <div class="flex justify-between mb-4">
            <h3 class="font-bold">Usuarios</h3>

            <button @click="crearUsuario"
              class="bg-pink-600 text-white px-4 py-2 rounded">
              + Crear
            </button>
          </div>

          <table class="w-full">
            <thead>
              <tr class="text-left text-sm text-gray-500">
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th class="text-right">Acciones</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="user in usuarios" :key="user.correo" class="border-t">

                <td>
                  <p class="font-bold">{{ user.nombre }}</p>
                  <p class="text-xs text-gray-500">{{ user.correo }}</p>
                </td>

                <td>{{ user.rol }}</td>

                <td>
                  <span :class="user.estado === 'Activo' ? 'text-green-600' : 'text-red-600'">
                    {{ user.estado }}
                  </span>
                </td>

                <td class="text-right space-x-2">
                  <button @click="editar(user)">✏️</button>
                  <button @click="toggleEstado(user)">⛔</button>
                  <button @click="eliminar(user.correo)">🗑️</button>
                </td>

              </tr>
            </tbody>
          </table>

        </section>

      </main>
    </div>

    <!-- MODAL -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div class="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h3 class="font-bold text-lg">
          {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>

        <input v-model="form.nombre" placeholder="Nombre" class="w-full border p-2 rounded"/>
        <input v-model="form.correo" placeholder="Correo" class="w-full border p-2 rounded disabled:bg-gray-200 disabled:cursor-not-allowed"
          :disabled="isEditing"/>
        <input v-model="form.contraseña" type="password" placeholder="Contraseña" class="w-full border p-2 rounded"/>

        <select v-model="form.rol" class="w-full border p-2 rounded">
          <option>Estudiante</option>
          <option>Auxiliar</option>
          <option>Administrador</option>
        </select>


        


        <div class="flex justify-end gap-2">
          <button @click="showModal = false">Cancelar</button>
          <button @click="guardarUsuario"
            class="bg-pink-600 text-white px-4 py-2 rounded">
            Guardar
          </button>
        </div>

      </div>
    </div>

  </div>
</template>