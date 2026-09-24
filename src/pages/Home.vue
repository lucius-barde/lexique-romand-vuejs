<script setup>
import { computed, ref } from 'vue'
import { searchTerms, termAnchor, termLetter } from '../lib/terms'

const search = ref('')
const results = ref([])
const loading = ref(false)
const error = ref('')
const hasSearched = ref(false)

const trimmedSearch = computed(() => search.value.trim())

async function handleSearch() {
  hasSearched.value = true
  error.value = ''
  results.value = []
  if (!trimmedSearch.value) return

  loading.value = true
  try {
    results.value = await searchTerms(trimmedSearch.value)
  } catch (err) {
    error.value = err.message || 'Impossible d’effectuer la recherche.'
  } finally {
    loading.value = false
  }
}

function readMoreLink(term) {
  return `/lexique/${termLetter(term)}#${termAnchor(term)}`
}

function shortDefinition(definition) {
  const text = String(definition || '')
  return text.length > 150 ? `${text.slice(0, 150).trimEnd()}…` : text
}
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <div class="w-full max-w-xl mx-auto flex flex-col gap-4 text-center">
      <img id="homepage_logo" src="/logo.png" alt="Lexique Romand" class="m-auto w-24 h-24" />
      <h1 class="text-xl font-semibold text-gray-900">Bienvenue sur le Lexique Romand</h1>
      <p class="text-sm text-gray-600">
        Recherchez un terme dans le lexique des expressions de Suisse romande.
      </p>

      <form class="flex gap-2" @submit.prevent="handleSearch">
        <label for="term-search" class="sr-only">Rechercher un terme</label>
        <input
          id="term-search"
          v-model="search"
          type="search"
          placeholder="Rechercher un terme..."
          class="min-w-0 flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
        />
        <button
          type="submit"
          class="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-950"
        >Rechercher</button>
      </form>

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="loading" class="text-sm text-gray-500">Recherche en cours…</p>
      <p v-else-if="hasSearched && trimmedSearch && results.length === 0" class="text-sm text-gray-500">
        Aucun résultat trouvé.
      </p>

      <div v-if="results.length" class="flex flex-col gap-3 text-left">
        <article v-for="term in results" :key="term.id" class="rounded-md border border-blue-200 bg-white p-3">
          <h2 class="text-base font-semibold text-gray-900">
            <RouterLink :to="readMoreLink(term)" class="hover:underline">{{ term.term }}</RouterLink>
          </h2>
          <p class="mt-1 text-sm text-gray-700">{{ shortDefinition(term.definition) }}</p>
          <RouterLink :to="readMoreLink(term)" class="mt-2 inline-block text-sm font-medium text-blue-900 hover:underline">
            Lire la suite...
          </RouterLink>
        </article>
      </div>
    </div>
  </main>
</template>
