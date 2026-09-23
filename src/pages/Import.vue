<script setup>
import { useAuth } from '../lib/useAuth'

const { isReady } = useAuth()
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <template v-if="isReady">
      <div class="text-center text-gray-500">
        <h1 class="text-lg font-semibold text-gray-900 mb-2">Importer des termes</h1>
        <p class="text-sm">Cette page est en construction.</p>
      </div>
    </template>
  </main>
</template>
