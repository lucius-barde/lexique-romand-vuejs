<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <div class="w-full max-w-sm mx-auto flex flex-col gap-4 text-center">
      <img id="homepage_logo" src="/logo.png" alt="Lexique Romand" class="m-auto w-24 h-24" />
      <h1 class="text-xl font-semibold text-gray-900">Bienvenue sur le Lexique Romand</h1>
      <p class="text-sm text-gray-600">
        Un lexique collaboratif des termes et expressions de Suisse romande,
        agrégé à partir de plusieurs sources.
      </p>
      <RouterLink
        to="/lexique"
        class="w-full rounded-md bg-blue-900 text-white py-2 text-sm font-medium hover:bg-blue-950"
      >
        Consulter le lexique
      </RouterLink>
    </div>
  </main>
</template>
