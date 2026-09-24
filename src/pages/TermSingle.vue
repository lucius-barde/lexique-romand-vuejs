<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getTermBySlug, formatDateShort } from '../lib/terms'
import { getReviewsForTerm, computeStats } from '../lib/reviews'
import { useReviewDialog } from '../lib/useReviewDialog'
import ReviewButton from '../components/ReviewButton.vue'
import ReviewDialog from '../components/ReviewDialog.vue'
import TermStats from '../components/TermStats.vue'
import TermComments from '../components/TermComments.vue'

const props = defineProps({
  source_identifier: { type: String, required: true },
  term: { type: String, required: true },
})

const termData = ref(null)
const reviews = ref([])
const loading = ref(true)
const error = ref('')

const stats = computed(() => computeStats(reviews.value))
const reviewCount = computed(() => reviews.value.length)

async function loadData() {
  loading.value = true
  error.value = ''
  try {
    const found = await getTermBySlug(props.source_identifier, props.term)
    if (!found) {
      error.value = 'Ce terme n\'a pas été trouvé.'
      termData.value = null
      return
    }
    termData.value = found
    reviews.value = await getReviewsForTerm(found.id)
  } catch (err) {
    error.value = err.message || 'Impossible de charger ce terme.'
  } finally {
    loading.value = false
  }
}

onMounted(loadData)
watch([() => props.source_identifier, () => props.term], loadData)

function adjustReviewCount(termId, delta) {
  // Le nombre de reviews est dérivé de reviews.value : on recharge la liste
  // complète pour rester cohérent avec les statistiques et les commentaires.
  loadData()
}

const {
  dialogOpen: reviewDialogOpen,
  dialogInitialValues: reviewInitialValues,
  dialogLoading: reviewLoading,
  dialogError: reviewError,
  openDialog: openReviewDialog,
  closeDialog: closeReviewDialog,
  submitDialog: submitReviewDialog,
  deleteDialogReview: deleteReviewDialog,
} = useReviewDialog(adjustReviewCount)
</script>

<template>
  <main class="flex-1 p-4">
    <div class="max-w-3xl mx-auto flex flex-col gap-6">
      <p v-if="loading" class="text-center text-gray-400 py-8">Chargement...</p>
      <p v-else-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>

      <template v-else-if="termData">
        <article class="rounded-md border border-blue-200 bg-white p-4">
          <div class="flex items-start justify-between gap-2">
            <div>
              <h1 class="text-lg font-semibold text-gray-900">
                {{ termData.term }}
                <span v-if="termData.pronunciation" class="text-sm font-normal text-gray-500">
                  [{{ termData.pronunciation }}]
                </span>
              </h1>
              <p class="text-xs text-gray-500">{{ termData.category }}</p>
            </div>
            <span class="text-xs text-gray-400 whitespace-nowrap">{{ formatDateShort(termData.edited) }}</span>
          </div>

          <div class="mt-4">
            <h2 class="text-sm font-semibold text-gray-900 mb-1">Définition</h2>
            <p class="text-sm text-gray-800" v-html="termData.definition"></p>
          </div>

          <div v-if="termData.example" class="mt-4">
            <h2 class="text-sm font-semibold text-gray-900 mb-1">Exemple</h2>
            <p class="text-sm text-gray-600 italic">« <span v-html="termData.example"></span> »</p>
          </div>

          <div v-if="termData.etymology" class="mt-4">
            <h2 class="text-sm font-semibold text-gray-900 mb-1">Étymologie</h2>
            <p class="text-sm text-gray-600" v-html="termData.etymology"></p>
          </div>

          <div v-if="termData.variants" class="mt-4">
            <h2 class="text-sm font-semibold text-gray-900 mb-1">Variantes</h2>
            <p class="text-sm text-gray-600">{{ termData.variants }}</p>
          </div>

          <p v-if="termData.present_in_regions" class="mt-4 text-xs text-gray-500">
            Régions : {{ termData.present_in_regions }}
          </p>

          <p class="mt-1 text-xs text-gray-400">
            Source :
            <a v-if="termData.source_url" :href="termData.source_url" target="_blank" class="underline">{{ termData.source_identifier }}</a>
            <span v-else>{{ termData.source_identifier }}</span>
          </p>

          <ReviewButton
            :count="reviewCount"
            :active="!!reviewInitialValues && reviewDialogOpen"
            @click="openReviewDialog(termData)"
          />
        </article>

        <div class="rounded-md border border-blue-200 bg-white p-4">
          <TermStats :stats="stats" />
        </div>

        <div class="rounded-md border border-blue-200 bg-white p-4">
          <TermComments :reviews="reviews" />
        </div>
      </template>
    </div>

    <ReviewDialog
      :open="reviewDialogOpen"
      :initial-values="reviewInitialValues"
      :loading="reviewLoading"
      :error="reviewError"
      @submit="submitReviewDialog"
      @delete="deleteReviewDialog"
      @cancel="closeReviewDialog"
    />
  </main>
</template>
