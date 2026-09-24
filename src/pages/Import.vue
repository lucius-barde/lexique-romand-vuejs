<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'
import { createTerm } from '../lib/terms'


const { user, isReady } = useAuth()
const router = useRouter()
const searchTerm = ref('')
const source = ref('hsuter')
const result = ref(null)
const error = ref('')
const searching = ref(false)
const inserting = ref(false)


const sourceLabels = {
  hsuter: 'Henrysuter.ch',
  hsuternames: 'Henrysuter.ch Noms Propres',
  topio: 'Topio.ch',
}

async function search() {
  error.value = ''
  result.value = null
  if (!searchTerm.value.trim()) {
    error.value = 'Veuillez saisir un terme à rechercher.'
    return
  }
  searching.value = true
  try {
    const response = await fetch(`/api/import?source=${encodeURIComponent(source.value)}&searchTerm=${encodeURIComponent(searchTerm.value.trim())}`)
    const data = await response.json()
    if (!response.ok) throw new Error(data.error || 'La recherche a échoué.')
    result.value = data.result
    if (!result.value) error.value = 'Aucun résultat trouvé.'
  } catch (err) {
    error.value = err.message || 'La recherche a échoué.'
  } finally {
    searching.value = false
  }
}

async function insertResult() {
  if (!result.value || !user.value) return
  inserting.value = true
  error.value = ''
  try {
    const inserted = await createTerm({
      term: result.value.term,
      category: result.value.category || 'Autre',
      definition: result.value.definition,
      example: result.value.example || null,
      variants: Array.isArray(result.value.variants) ? result.value.variants.join(', ') || null : result.value.variants || null,
      source_identifier: result.value.source_id || source.value,
      source_url: result.value.source || null,
      author_id: user.value.id,
    })
    router.push({ name: 'term-edit', params: { id: inserted.id } })
  } catch (err) {
    error.value = err.message || "Impossible d'insérer le terme."
  } finally {
    inserting.value = false
  }
}
</script>

<template>
  <main class="flex-1 p-4 sm:p-8">
    <template v-if="isReady">
      <div v-if="!user" class="text-center text-gray-500">Veuillez vous connecter pour accéder à cette page.</div>
      <div v-else class="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <section class="flex flex-col gap-5">
          <h1 class="text-2xl font-semibold">Importer un terme</h1>
          <form class="flex max-w-xl flex-col gap-4" @submit.prevent="search">
            <div>
              <label for="import-term" class="mb-1 block text-sm font-medium">Terme à rechercher</label>
              <input id="import-term" v-model="searchTerm" type="text" required class="w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label for="import-source" class="mb-1 block text-sm font-medium">Source</label>
              <select id="import-source" v-model="source" class="w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="hsuter">Henrysuter.ch</option>
                <option value="hsuternames">Henrysuter.ch Noms Propres</option>
                <option value="topio">Topio.ch</option>
              </select>
            </div>
            <button type="submit" :disabled="searching" class="rounded-md bg-blue-900 px-4 py-2 text-white hover:bg-blue-950 disabled:opacity-50">{{ searching ? 'Recherche en cours...' : 'Lancer la recherche' }}</button>
          </form>

          <p v-if="error" role="alert" class="text-sm text-red-600">{{ error }}</p>
          <article v-if="result" class="rounded-md border border-gray-200 bg-white p-4">
            <h2 class="mb-3 text-lg font-semibold">Résultat trouvé pour {{ searchTerm }}</h2>
            <pre class="overflow-x-auto rounded bg-gray-50 p-3 text-sm">{{ JSON.stringify(result, null, 2) }}</pre>
            <button type="button" :disabled="inserting" class="mt-4 rounded-md bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50" @click="insertResult">{{ inserting ? 'Insertion...' : 'Insérer dans la base de données' }}</button>
          </article>
        </section>

      </div>
    </template>
  </main>
</template>
