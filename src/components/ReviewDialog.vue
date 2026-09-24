<script setup>
import { ref, computed, watch } from 'vue'
import { REGIONS } from '../lib/regions'
import {
  SELF_USAGE_LABELS,
  PERCEIVED_USAGE_LABELS,
  PERCEIVED_CONTEXT_LABELS,
} from '../lib/reviewOptions'

const props = defineProps({
  open: { type: Boolean, default: false },
  // Avis existant de l'utilisateur pour ce terme, ou null si pas encore d'avis.
  initialValues: { type: Object, default: null },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
})

const emit = defineEmits(['submit', 'delete', 'cancel'])

const isEditing = computed(() => !!props.initialValues)

const termSelfUsage = ref(3)
const termPerceivedUsage = ref(3)
const termWrittenUsage = ref(false)
const termPerceivedContext = ref(3)
const selectedRegions = ref([])
const termReviewMessage = ref('')

function resetForm() {
  const values = props.initialValues
  termSelfUsage.value = values?.term_self_usage ?? 3
  termPerceivedUsage.value = values?.term_perceived_usage ?? 3
  termWrittenUsage.value = values?.term_written_usage ?? false
  termPerceivedContext.value = values?.term_perceived_context ?? 3
  selectedRegions.value = values?.term_regions
    ? values.term_regions.split(',').map((r) => r.trim()).filter(Boolean)
    : []
  termReviewMessage.value = values?.term_review_message ?? ''
}

// Réinitialise le formulaire chaque fois que la boîte de dialogue s'ouvre.
watch(() => props.open, (isOpen) => {
  if (isOpen) resetForm()
})

function toggleRegion(code) {
  const idx = selectedRegions.value.indexOf(code)
  if (idx === -1) {
    selectedRegions.value.push(code)
  } else {
    selectedRegions.value.splice(idx, 1)
  }
}

function handleSubmit() {
  emit('submit', {
    term_self_usage: Number(termSelfUsage.value),
    term_perceived_usage: Number(termPerceivedUsage.value),
    term_written_usage: termWrittenUsage.value === true || termWrittenUsage.value === 'true',
    term_perceived_context: Number(termPerceivedContext.value),
    term_regions: selectedRegions.value.join(','),
    term_review_message: termReviewMessage.value || null,
  })
}

function handleDelete() {
  emit('delete')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 overflow-y-auto"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-5 shadow-lg my-8">
      <h2 class="text-base font-semibold text-gray-900 mb-4">
        {{ isEditing ? 'Éditer votre avis' : 'Ajouter un avis' }}
      </h2>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Utilisez-vous ce terme régulièrement ?
          </label>
          <select
            v-model="termSelfUsage"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option v-for="(label, value) in SELF_USAGE_LABELS" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            À quelle fréquence entendez-vous ce terme ?
          </label>
          <select
            v-model="termPerceivedUsage"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option v-for="(label, value) in PERCEIVED_USAGE_LABELS" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Terme plutôt oral ou écrit ?
          </label>
          <select
            v-model="termWrittenUsage"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option :value="false">Oral uniquement</option>
            <option :value="true">Écrit et oral</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Comment jugeriez-vous le contexte où ce terme est utilisé ?
          </label>
          <select
            v-model="termPerceivedContext"
            required
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          >
            <option v-for="(label, value) in PERCEIVED_CONTEXT_LABELS" :key="value" :value="value">
              {{ label }}
            </option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Régions où le terme est utilisé
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="region in REGIONS"
              :key="region.code"
              type="button"
              @click="toggleRegion(region.code)"
              class="rounded-md px-2 py-1 text-xs font-medium cursor-pointer"
              :class="selectedRegions.includes(region.code)
                ? 'bg-blue-900 text-white'
                : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
            >
              {{ region.label }}
            </button>
          </div>
        </div>

        <div>
          <label for="term_review_message" class="block text-sm font-medium text-gray-700 mb-1">
            Commentaire (sera affiché publiquement)
          </label>
          <textarea
            id="term_review_message"
            v-model="termReviewMessage"
            rows="3"
            class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
          ></textarea>
        </div>

        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

        <div class="flex gap-2">
          <button
            type="button"
            @click="emit('cancel')"
            class="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
          >
            Annuler
          </button>
          <button
            v-if="isEditing"
            type="button"
            @click="handleDelete"
            :disabled="loading"
            class="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 cursor-pointer"
          >
            Supprimer
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="flex-1 rounded-md bg-blue-900 px-3 py-2 text-sm font-medium text-white hover:bg-blue-950 disabled:opacity-50 cursor-pointer"
          >
            {{ loading ? 'Enregistrement...' : 'Valider' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
