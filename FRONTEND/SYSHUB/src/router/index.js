import { createRouter, createWebHistory } from 'vue-router'

// Función para saber si está logueado
const estaAutenticado = () => {
  return !!localStorage.getItem('usuario')
}

const routes = [

  // HOME PRINCIPAL
  {
    path: '/',
    component: () => import('../views/HomeView.vue'),

    children: [
      {
        path: '',
        redirect: '/feed'
      },
      {
        path: 'feed',
        component: () => import('../views/estudiante/FeedView.vue')
      },
      {
        path: 'proyectos',
        component: () => import('../views/estudiante/ProyectoView.vue')
      }
    ]
  },

  // LOGIN
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },

  // REGISTRO
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/RegistroView.vue')
  },

  // ADMIN
  {
    path: '/homeAdmin',
    component: () => import('../views/AdminHomeView.vue'),
    meta: { requiresAuth: true },

    children: [
      {
        path: '',
        redirect: '/homeAdmin/usuarios'
      },
      {
        path: 'usuarios',
        component: () => import('../views/admin/GestionUsuariosView.vue')
      },
      {
        path: 'contenido',
        component: () => import('../views/admin/GestioContenidoView.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// GUARD
router.beforeEach((to) => {

  const logueado = estaAutenticado()

  // Si requiere auth y no está logueado
  if (to.meta.requiresAuth && !logueado) {
    return '/login'
  }

  // Si ya está logueado y quiere ir a login
  if (to.path === '/login' && logueado) {
    return '/'
  }

  return true
})

export default router