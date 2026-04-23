<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue';

const isStudent = computed(() => user.value?.rol === 1);
const isAuxiliar = computed(() => user.value?.rol === 2);

const router = useRouter();

// ESTADO USUARIO
const user = ref(null)

// Estado posts
const posts = ref([])
const loading = ref(false)
const page = ref(1)

// Cargar sesión guardada
onMounted(() => {
  const savedUser = localStorage.getItem('usuario')
  if (savedUser) user.value = JSON.parse(savedUser)

  fetchPosts()
})

// LOGOUT
const logout = () => {
  user.value = null
  localStorage.removeItem('usuario')
}

// Simulación API
const fetchPosts = async () => {
  if (loading.value) return

  loading.value = true

  await new Promise(resolve => setTimeout(resolve, 800))

  const newPosts = Array.from({ length: 5 }, (_, i) => ({
    id: page.value * 10 + i,
    title: `Post académico ${page.value * 10 + i}`,
    content: "Contenido dinámico cargado automáticamente..."
  }))

  posts.value.push(...newPosts)
  page.value++

  loading.value = false
}

// Scroll infinito
const handleScroll = (e) => {
  const el = e.target

  if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
    fetchPosts()
  }
}
</script>

<template>
  <div class="bg-surface text-on-surface h-screen overflow-hidden">

    <!-- NAVBAR -->
    <nav class="bg-[#f6f3f5] sticky top-0 z-50 px-6 py-3 flex justify-between items-center">

      <span class="text-2xl font-black text-[#003366]">SYSHUB</span>

      <div class="hidden md:flex bg-white px-4 py-2 rounded-lg w-96">
        <input class="w-full outline-none text-sm" placeholder="Buscar..." />
      </div>

      <!-- LOGIN / USER -->
      <div class="flex items-center gap-4">

  <!-- NO LOGUEADO -->
  <template v-if="!user">

    <!-- BOTÓN LOGIN -->
    <button
      v-if="!user"
      @click="router.push('/login')"
      class="bg-pink-500 text-white px-4 py-2 rounded-lg hover:scale-105 transition"
    >
      Iniciar sesión
    </button>

    <!-- LINK REGISTRO -->
    <button
      @click="router.push('/registro')"
      class="text-[#3a5f94] font-semibold hover:underline"
    >
      Registrarse
    </button>

  </template>

  <!-- LOGUEADO -->
  <div v-else class="flex items-center gap-3">

    <div class="text-right hidden sm:block">
      <p class="text-xs font-bold">{{ user.correo }}</p>
      <p class="text-[10px] text-secondary uppercase">{{ user.rol }}</p>
    </div>

    <img
      :src="user.avatar"
      class="w-9 h-9 rounded-full"
    />

  </div>

</div>

    </nav>

    <!-- CONTENIDO -->
    <div class="flex h-[calc(100vh-64px)]">

      <!-- SIDEBAR -->
      <aside class="hidden lg:flex flex-col justify-between w-64 p-4 pt-20 bg-[#f6f3f5] h-full">

        <!-- MENÚ -->
        <nav class="space-y-2">
          <a class="flex items-center gap-2 p-3 bg-white rounded-lg font-bold text-pink-600">
            <span class="material-symbols-outlined">home</span> Inicio
          </a>

          <a class="flex items-center gap-2 p-3 hover:bg-white rounded-lg">
            <span class="material-symbols-outlined">trending_up</span> Popular
          </a>

          <a
            v-if="isStudent"
            class="flex items-center gap-3 px-4 py-3 text-[#3a5f94] hover:bg-white rounded-lg"
          >
            <span class="material-symbols-outlined">rocket_launch</span> PROYECTOS
          </a>

          <a class="flex items-center gap-3 px-4 py-3 text-[#3a5f94] hover:bg-white rounded-lg">
            <span class="material-symbols-outlined">help_center</span> FORO
          </a>
        </nav>

        <!-- LOGOUT ABAJO -->
        <div v-if="user" class="mt-6">
          <button
            @click="logout"
            class="w-full bg-red-500 text-white py-2 rounded-lg hover:scale-105 transition"
          >
            Cerrar sesión
          </button>
        </div>

      </aside>

      <!-- MAIN -->
      <main class="flex-1 lg:ml-64 grid xl:grid-cols-12 gap-8 overflow-hidden p-6">

        <!-- FEED -->
        <div
          class="xl:col-span-8 overflow-y-auto h-full pr-4 space-y-6"
          @scroll="handleScroll"
        >

          <h1 class="text-4xl font-bold text-secondary">
            Feed Académico
          </h1>

          <!-- POSTS -->
          <transition-group name="fade" tag="div" class="space-y-6">
            <div
              v-for="post in posts"
              :key="post.id"
              class="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <h2 class="text-xl font-bold mb-2">
                {{ post.title }}
              </h2>
              <p class="text-gray-600 text-sm">
                {{ post.content }}
              </p>
            </div>
          </transition-group>

          <!-- LOADING -->
          <div v-if="loading" class="text-center py-4 text-gray-500">
            Cargando más publicaciones...
          </div>

        </div>

        <!-- PANEL DERECHO -->
        <div class="xl:col-span-4 h-full flex items-start">
          <div
  v-if="user"
  class="bg-secondary text-white p-6 rounded-xl w-full sticky top-6 space-y-3"
>
  <h3 class="text-xl font-bold mb-4">
    Laboratorio Académico
  </h3>

  <!-- BOTÓN GENERAL -->
  <button class="w-full bg-pink-500 py-2 rounded hover:scale-105 transition">
    Crear Publicación
  </button>

  <!-- SOLO ESTUDIANTE -->
  <button
    v-if="isStudent"
    class="w-full border py-2 rounded hover:bg-white/20 transition"
  >
    Hacer Pregunta
  </button>

  <!-- 🔥 SOLO AUXILIAR -->
  <button
    v-if="isAuxiliar"
    class="w-full bg-[#3a5f94] py-2 rounded hover:scale-105 transition"
  >
    Subir Material de Apoyo
  </button>

</div>
        </div>

      </main>
    </div>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
</style>