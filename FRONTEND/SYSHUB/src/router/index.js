import { createRouter, createWebHistory } from 'vue-router'

//import DashboardView from '../views/DashboardView.vue'
//import LoginView from '../views/LoginView.vue'
//import HomeView from '../views/HomeView.vue'
//import RegistroView from '../views/RegistroView.vue'

//Funcion para saber si esta logueado
const estaAutenticado = () => {
  return !!localStorage.getItem('usuario')
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/RegistroView.vue')
  },

  // ADMIN LAYOUT
  {
    path: '/homeAdmin',
    component: () => import('../views/AdminHomeView.vue'),
    meta: { requiresAuth: true },
    
    children: [
      {
        path: '',
        redirect: '/homeAdmin/usuarios' // vista por defecto
      },
      {
        path: 'usuarios',
        component: () => import('../views/admin/GestionUsuariosView.vue')
      },
      {
        path: 'contenido',
        component: () => import('../views/admin/GestioContenidoView.vue')
      }/*,
      {
        path: 'moderacion',
        component: () => import('../views/admin/AdminModeracionView.vue')
      }*/
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const logueado = estaAutenticado()

  // Si requiere auth y NO está logueado
  if (to.meta.requiresAuth && !logueado) {
    return '/login'
  }

  // Si ya está logueado y quiere ir a login
  if (to.path === '/login' && logueado) {
    return '/'
  }

  // Permitir navegación
  return true
})

export default router