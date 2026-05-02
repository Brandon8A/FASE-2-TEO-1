<script setup>
import { onMounted, ref } from 'vue'
import axios from 'axios'

const usuarios = ref([])
const usuarioActual = JSON.parse(localStorage.getItem('usuario'))

// Obtener usuarios una vez que inicie la vista
onMounted(() => {
  obtenerUsuarios()
})

//Metodo para obtener los usuarios registrados en el sistema
const obtenerUsuarios = async () => {
  try {
    const response = await axios.get('http://localhost:3000/usuarios')

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
  rol: 'Estudiante'
})

// CREAR NUEVO USUARIO POR ADMINISTRADOR
const crearUsuario = () => {
  isEditing.value = false
  form.value = { nombre: '', correo: '', contraseña: '', rol: 'Estudiante' }
  showModal.value = true
}

// EDITAR USUARIO POR ADMINISTRADOR
const editar = (user) => {
  isEditing.value = true
  form.value = { ...user, contraseña: '' }
  showModal.value = true
}

// GUARDAR USUARIO POR ADMINISTRADOR
const guardarUsuario = async () => {
  try {

    if (!form.value.nombre || !form.value.correo) {
      alert('Nombre y correo son obligatorios')
      return
    }

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

    if (isEditing.value) {
      await axios.patch(
        `http://localhost:3000/usuarios/${form.value.correo}/actualizar`,
        data
      )

      const index = usuarios.value.findIndex(u => u.correo === form.value.correo)
      if (index !== -1) {
        usuarios.value[index].nombre = form.value.nombre
        usuarios.value[index].rol = form.value.rol
      }

    } else {
      await axios.post('http://localhost:3000/auth/register', {
        ...data,
        correo: form.value.correo
      })

      usuarios.value.push({
        nombre: form.value.nombre,
        correo: form.value.correo,
        rol: form.value.rol,
        estado: 'Activo'
      })
    }

    alert('Usuario registrado con exito')
    showModal.value = false

  } catch (error) {
    alert('Error al registrar nuevo usuario')
    console.error('Error al guardar:', error.response?.data || error.message)
  }
}

// "ELIMINAR" USUARIO POR ADMINISTRADOR
const eliminar = async (correo) => {
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return

  try {
    await axios.patch(`http://localhost:3000/usuarios/${correo}/eliminar`)
    usuarios.value = usuarios.value.filter(u => u.correo !== correo)
    alert('Usuario eliminado correctamente')
  } catch (error) {
    console.error('Error al eliminar:', error.response?.data || error.message)
    alert('Error al eliminar usuario')
  }
}

// CAMBIAR ESTADO
const toggleEstado = async (user) => {
  try {
    const nuevoEstado = user.estado === 'Activo'

    await axios.patch(`http://localhost:3000/usuarios/${user.correo}/suspender`, {
      suspendido: nuevoEstado
    })

    user.estado = nuevoEstado ? 'Suspendido' : 'Activo'

    alert('Usuario suspendido correctamente')

  } catch (error) {
    alert('Error al suspender usuario')
    console.error('Error al cambiar estado:', error.response?.data || error.message)
  }
}
</script>

<template>
  <div class="space-y-6">

    <!-- TABLA 
    <h2 class="text-3xl font-bold">
      Gestión de Usuarios
    </h2>
    -->
    <h2 class="text-secondary text-4xl lg:text-5xl font-extrabold tracking-tight">
      Gestión de Usuarios
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
              <button @click="editar(user)"
                :disabled="user.correo === usuarioActual.correo">
                ✏️
              </button>

              <button @click="toggleEstado(user)"
                :disabled="user.correo === usuarioActual.correo">
                ⛔
              </button>

              <button @click="eliminar(user.correo)"
                :disabled="user.correo === usuarioActual.correo">
                🗑️
              </button>
            </td>

          </tr>
        </tbody>
      </table>

    </section>

    <!-- MODAL -->
    <div v-if="showModal"
      class="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div class="bg-white p-6 rounded-xl w-[400px] space-y-4">

        <h3 class="font-bold text-lg">
          {{ isEditing ? 'Editar Usuario' : 'Crear Usuario' }}
        </h3>

        <input v-model="form.nombre" placeholder="Nombre" class="w-full border p-2 rounded"/>
        <input v-model="form.correo" placeholder="Correo"
          class="w-full border p-2 rounded"
          :disabled="isEditing"/>
        <input v-model="form.contraseña" type="password"
          placeholder="Contraseña"
          class="w-full border p-2 rounded"/>

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