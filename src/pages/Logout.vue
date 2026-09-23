<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'

const router = useRouter()
const { signOut } = useAuth()

onMounted(async () => {
  await signOut()
  router.replace('/')
})
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <p class="text-sm text-gray-500">Déconnexion...</p>
  </main>
</template>
