<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'
import { listTerms, deleteTerm, formatDateShort, PAGE_SIZE } from '../lib/terms'
import AlphabetNav from '../components/AlphabetNav.vue'
import Pagination from '../components/Pagination.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'

const props = defineProps({
  letter: { type: String, default: null },
  page: { type: String, default: '1' },
})

const { user } = useAuth()
const router = useRouter()

const terms = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref('')

const currentPage = computed(() => Math.max(1, parseInt(props.page, 10) || 1))
const activeLetter = computed(() => (props.letter ? props.letter.toUpperCase() : null))
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / PAGE_SIZE)))

function buildHref(page) {
  if (activeLetter.value) {
    return page === 1
      ? `/lexique/${activeLetter.value.toLowerCase()}`
      : `/lexique/${activeLetter.value.toLowerCase()}/page/${page}`
  }
  return page === 1 ? '/lexique' : `/lexique/page/${page}`
}

async function loadTerms() {
  loading.value = true
  error.value = ''
  try {
    const result = await listTerms({ page: currentPage.value, letter: activeLetter.value })
    terms.value = result.terms
    total.value = result.total
  } catch (err) {
    error.value = err.message || 'Impossible de charger le lexique.'
  } finally {
    loading.value = false
  }
}

watch([currentPage, activeLetter], loadTerms, { immediate: true })

// Gestion de la boîte de dialogue de confirmation (suppression)
const dialog = ref({ open: false, term: null })

function askDelete(term) {
  dialog.value = { open: true, term }
}

function closeDialog() {
  dialog.value = { open: false, term: null }
}

const dialogMessage = computed(() => {
  if (!dialog.value.term) return ''
  return `Voulez-vous vraiment supprimer le terme "${dialog.value.term.term}" ?`
})

async function confirmDialog() {
  const { term } = dialog.value
  if (!term) return
  try {
    await deleteTerm(term.id)
    terms.value = terms.value.filter((t) => t.id !== term.id)
  } catch (err) {
    error.value = err.message || 'Une erreur est survenue.'
  } finally {
    closeDialog()
  }
}
</script>

<template>
  <main class="flex-1 p-4">
    <div class="max-w-3xl mx-auto flex flex-col gap-6">
      <h1 class="text-lg font-semibold text-gray-900 text-center">
        {{ activeLetter ? `Lexique — lettre ${activeLetter}` : 'Lexique complet' }}
      </h1>

      <AlphabetNav :active-letter="activeLetter" />

      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

      <Pagination :current-page="currentPage" :total-pages="totalPages" :build-href="buildHref" />

      <div class="flex flex-col gap-4">
        <article
          v-for="term in terms"
          :key="term.id"
          class="rounded-md border border-blue-200 bg-white p-4"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <h2 class="text-base font-semibold text-gray-900">
                {{ term.term }}
                <span v-if="term.pronunciation" class="text-sm font-normal text-gray-500">
                  [{{ term.pronunciation }}]
                </span>
              </h2>
              <p class="text-xs text-gray-500">{{ term.category }}</p>
            </div>
            <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatDateShort(term.edited) }}</span>
          </div>

          <p class="mt-2 text-sm text-gray-800">{{ term.definition }}</p>

          <p v-if="term.example" class="mt-1 text-sm text-gray-600 italic">« {{ term.example }} »</p>
          <p v-if="term.etymology" class="mt-1 text-xs text-gray-500">Étymologie : {{ term.etymology }}</p>
          <p v-if="term.variants" class="mt-1 text-xs text-gray-500">Variantes : {{ term.variants }}</p>
          <p v-if="term.present_in_regions" class="mt-1 text-xs text-gray-500">
            Régions : {{ term.present_in_regions }}
          </p>
          <p class="mt-1 text-xs text-gray-400">
            Source :
            <a v-if="term.source_url" :href="term.source_url" target="_blank" class="underline">{{ term.source_identifier }}</a>
            <span v-else>{{ term.source_identifier }}</span>
          </p>

          <div v-if="user" class="mt-3 flex flex-nowrap gap-2">
            <RouterLink
              :to="`/term/${term.id}/edit`"
              class="rounded-md px-2 py-1 text-xs font-medium text-white bg-blue-900 hover:bg-blue-950"
            >
              Éditer le terme
            </RouterLink>
            <button
              type="button"
              @click="askDelete(term)"
              class="rounded-md bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 cursor-pointer"
            >
              Supprimer le terme
            </button>
          </div>
        </article>

        <p v-if="!loading && terms.length === 0" class="text-center text-gray-400 py-8">
          Aucun terme trouvé.
        </p>
      </div>

      <Pagination :current-page="currentPage" :total-pages="totalPages" :build-href="buildHref" />
    </div>

    <ConfirmDialog
      :open="dialog.open"
      :message="dialogMessage"
      confirm-label="Supprimer"
      @confirm="confirmDialog"
      @cancel="closeDialog"
    />
  </main>
</template>
