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
    meta: { requiresAuth: true },

    children: [
      {
        path: '',
        redirect: '/feed'
      },
      //FEED
      {
        path: 'feed',
        component: () => import('../views/estudiante/FeedView.vue')
      },
      //PROYECTOS
      {
        path: 'proyectos',
        component: () => import('../views/estudiante/ProyectoView.vue')
      },
      //DESTACADOS
      {
        path: 'destacados',
        name: 'destacados',
        component: () => import('../views/auxiliar/DestacadosView.vue')
      },

      // PUBLICACIONES
      {
        path: 'publicaciones',
        name: 'publicaciones',
        component: () => import('../views/auxiliar/PublicacionesView.vue')
      },

      //Blogs Articulos
      {
        path: 'blogsArticulos',
        name: 'blogsArticulos',
        component: () => import('../views/auxiliar/BlogsArticuloView.vue')
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
      },
      {
        path: 'moderacion',
        component: () => import('../views/admin/GestionModeracionView.vue')
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