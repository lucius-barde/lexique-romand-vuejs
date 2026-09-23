<script setup>
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'
import LoginForm from '../components/LoginForm.vue'

const router = useRouter()
const { user, isReady } = useAuth()

// Si déjà connecté, on redirige vers le lexique.
if (isReady.value && user.value) {
  router.replace('/lexique')
}
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <template v-if="isReady">
      <div v-if="user" class="text-center text-gray-500">Vous êtes déjà connecté.</div>
      <LoginForm v-else />
    </template>
  </main>
</template>
