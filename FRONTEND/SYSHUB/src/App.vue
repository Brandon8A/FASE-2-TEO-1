<script setup>
import DashboardView from './views/DashboardView.vue'
import HomeView from './views/HomeView.vue';
import LoginView from './views/LoginView.vue';
import RegistroView from './views/RegistroView.vue';

import { computed } from 'vue'

const isStudent = computed(() => {
  return user.value && user.value.role === "Estudiante"
})

</script>

<template>
  <!--
  <DashboardView />
  
  
  <LoginView />
  
  <RegistroView/>
  <HomeView />
  -->
  <router-view />
</template>