import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import RegistroView from '../views/RegistroView.vue'

//Funcion para saber si esta logueado
const estaAutenticado = () => {
  return !!localStorage.getItem('user')
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/registro',
    name: 'registro',
    component: RegistroView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) =>{
  const logueado = estaAutenticado()

  //Si la ruta requiere autenticación y no esta logueado
  if (to.meta.requiresAuth && !logueado) {
    next('/login')
  } else if (to.path === '/login' && logueado) {//Si ya está logueado y quiere ir al login
    next('/')
  } else {
    next()
  }
})

export default router