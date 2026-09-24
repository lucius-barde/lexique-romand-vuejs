<script setup>
import { ALPHABET } from '../lib/terms'

defineProps({
  activeLetter: {
    type: String,
    default: null,
  },
  activeTop: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <nav class="flex flex-wrap justify-center gap-1">
    <RouterLink
      to="/lexique"
      class="rounded-md px-2.5 py-1.5 text-sm font-medium"
      :class="!activeLetter && !activeTop
        ? 'bg-blue-900 text-white'
        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
    >
      🕙
    </RouterLink>
    <RouterLink
      to="/lexique/top"
      class="rounded-md px-2.5 py-1.5 text-sm font-medium"
      :class="activeTop
        ? 'bg-blue-900 text-white'
        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
      aria-label="Termes les plus avisés"
      title="Termes les plus avisés"
    >
      👍
    </RouterLink>
    <RouterLink
      v-for="letter in ALPHABET"
      :key="letter"
      :to="`/lexique/${letter.toLowerCase()}`"
      class="rounded-md px-2.5 py-1.5 text-sm font-medium"
      :class="activeLetter === letter
        ? 'bg-blue-900 text-white'
        : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
    >
      {{ letter }}
    </RouterLink>
  </nav>
</template>
