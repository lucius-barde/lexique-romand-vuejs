<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'

const { signIn } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await signIn(email.value, password.value)
    router.push('/lexique')
  } catch (err) {
    error.value = err.message || 'Connexion impossible.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-sm mx-auto flex flex-col gap-4">
     <img id="homepage_logo" src="/logo.png" alt="Lexique Romand" class="m-auto w-24 h-24" />
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        autocomplete="email"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        autocomplete="current-password"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>
    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
    <button
      type="submit"
      :disabled="loading"
      class="w-full rounded-md bg-blue-900 text-white cursor-pointer py-2 text-sm font-medium hover:bg-blue-950 disabled:opacity-50"
    >
      {{ loading ? 'Connexion...' : 'Se connecter' }}
    </button>
  </form>
</template>
