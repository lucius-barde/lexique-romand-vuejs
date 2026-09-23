<script setup>
import { ALPHABET } from '../lib/terms'

defineProps({
  activeLetter: {
    type: String,
    default: null,
  },
})
</script>

<template>
  <nav class="flex flex-wrap justify-center gap-1">
    <RouterLink
      to="/lexique"
      class="rounded-md px-2 py-1 text-xs font-medium"
      :class="!activeLetter
        ? 'bg-blue-900 text-white'
        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
    >
      Tous
    </RouterLink>
    <RouterLink
      v-for="letter in ALPHABET"
      :key="letter"
      :to="`/lexique/${letter.toLowerCase()}`"
      class="rounded-md px-2 py-1 text-xs font-medium"
      :class="activeLetter === letter
        ? 'bg-blue-900 text-white'
        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
    >
      {{ letter }}
    </RouterLink>
  </nav>
</template>
