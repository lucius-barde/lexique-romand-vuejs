<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages: { type: Number, required: true },
  // Fonction qui construit l'URL d'une page donnée (ex: (n) => `/lexique/page/${n}`)
  buildHref: { type: Function, required: true },
})

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)
</script>

<template>
  <nav v-if="totalPages > 1" class="flex items-center justify-center gap-4 text-sm">
    <RouterLink
      v-if="hasPrevious"
      :to="buildHref(currentPage - 1)"
      class="rounded-md px-3 py-1.5 font-medium text-white bg-blue-900 hover:bg-blue-950"
    >
      ← Précédent
    </RouterLink>
    <span class="text-gray-600">Page {{ currentPage }} / {{ totalPages }}</span>
    <RouterLink
      v-if="hasNext"
      :to="buildHref(currentPage + 1)"
      class="rounded-md px-3 py-1.5 font-medium text-white bg-blue-900 hover:bg-blue-950"
    >
      Suivant →
    </RouterLink>
  </nav>
</template>
