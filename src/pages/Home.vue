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

      <RouterLink to="/lexique" class="hover:opacity-80" title="Ouvrir le lexique">
          <img id="homepage_logo" src="/logo.png" alt="Lexique Romand" class="m-auto w-24 h-24" />
      </RouterLink>

      <h1 class="text-xl font-semibold text-gray-900">Lexique romand interactif</h1>

      <p class="text-sm text-gray-600">
        Adjeu, ça joue ou bien ? Ce site est un dictionnaire du parler suisse romand où tu peux apporter ta contribution. Tetcheu c'est bonnard non ou bien ?
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

      <div class="mb-8">
          <RouterLink class="underline font-bold" to="/lexique">
            Mises à jour récentes
          </RouterLink>
          &nbsp;-&nbsp;
          <RouterLink class="underline font-bold" to="/lexique">
            Termes les plus populaires
          </RouterLink>
      </div>

      <details>
          <summary class="underline cursor-pointer">Explique-voir un peu ce commerce...</summary>
          <p class="text-sm text-left text-gray-600 mt-4"><strong>Un patrimoine à préserver</strong><br /> Cette appli pour ordi et pour natel a été conçue par un Romand soucieux de la préservation du parler bien d'chez nous. Ce projet se place dans la continuité des lexiques de Topio.ch et Henrysuter.ch, qui sont des sources inestimables en matière de parler vaudois et suisse romand, mais qui semblent aujourd'hui abandonnés et qui ne sont pas pratiques à utiliser en 2026 (sites non-mobiles, sans moteur de recherche).
              <br />
              <br />
              <strong>Un projet ouvert aux contributions</strong><br />
              LexiqueRomand se veut être une plateforme mobile et tenue à jour grâce à l'ouverture aux contributions. Venez-donc-voir nous dire si un terme est d'chez vous, s'il est plutôt oral ou écrit, s'il est utilisé aussi par les jeunes ou seulement par les plus âgées, ou s'il a disparu.
          </p>
      </details>

      <details>
          <summary class="underline cursor-pointer">Politique de confidentialité</summary>
          <p class="text-sm text-left text-gray-600 mt-4">Le projet est maintenu par Lucien, dit Lucius Barde (<a href="https://www.github.com/lucius-barde/lexique-romand-vuejs.git">Code source</a>). Le projet est ouvert aux alpha-testeurs et beta-testeurs. Les données que vous envoyez via le formulaire de commentaires ou via l'insertion de termes sont stockées dans la base de données du site (données stockées en Irlande). L'administrateur se réserve le droit de modérer ou supprimer les commentaires hors-sujet ou ne respectant pas la loi.</p>
      </details>

      <details>
          <summary class="underline cursor-pointer">Contact et inscription</summary>
          <p class="text-sm text-center text-gray-600 mt-4">Pour devenir testeur et contribuer au lexique, contacter Lucius par e-mail:<br /><strong>carteblanche [at] tutamail [point] com</strong><br />Seules les demandes sérieuses et motivées seront prises en compte.</p>
      </details>

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
          <p class="mt-1 text-sm text-gray-700" v-html="shortDefinition(term.definition)"></p>
          <RouterLink :to="readMoreLink(term)" class="mt-2 inline-block text-sm font-medium text-blue-900 hover:underline">
            Lire la suite...
          </RouterLink>
        </article>
      </div>
    </div>
  </main>
</template>
