<script setup>
import { ref } from 'vue'
import { CATEGORIES } from '../lib/categories'

const props = defineProps({
  // Valeurs initiales du formulaire (utilisé aussi bien pour créer que pour éditer)
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: 'Ajouter',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['submit'])

const term = ref(props.initialValues.term ?? '')
const category = ref(props.initialValues.category ?? CATEGORIES[0])
const definition = ref(props.initialValues.definition ?? '')
const example = ref(props.initialValues.example ?? '')
const etymology = ref(props.initialValues.etymology ?? '')
const sourceIdentifier = ref(props.initialValues.source_identifier ?? '')
const sourceUrl = ref(props.initialValues.source_url ?? '')
const pronunciation = ref(props.initialValues.pronunciation ?? '')
const variants = ref(props.initialValues.variants ?? '')
const presentInRegions = ref(props.initialValues.present_in_regions ?? '')

function handleSubmit() {
  emit('submit', {
    term: term.value,
    category: category.value,
    definition: definition.value,
    example: example.value || null,
    etymology: etymology.value || null,
    source_identifier: sourceIdentifier.value,
    source_url: sourceUrl.value || null,
    pronunciation: pronunciation.value || null,
    variants: variants.value || null,
    present_in_regions: presentInRegions.value || null,
  })
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="w-full max-w-sm mx-auto flex flex-col gap-4">
    <div>
      <label for="term" class="block text-sm font-medium text-gray-700 mb-1">Terme</label>
      <input
        id="term"
        v-model="term"
        type="text"
        required
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <div>
      <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
      <select
        id="category"
        v-model="category"
        required
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      >
        <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
      </select>
    </div>

    <div>
      <label for="definition" class="block text-sm font-medium text-gray-700 mb-1">Définition</label>
      <textarea
        id="definition"
        v-model="definition"
        rows="3"
        required
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      ></textarea>
    </div>

    <div>
      <label for="example" class="block text-sm font-medium text-gray-700 mb-1">Exemple</label>
      <textarea
        id="example"
        v-model="example"
        rows="2"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      ></textarea>
    </div>

    <div>
      <label for="etymology" class="block text-sm font-medium text-gray-700 mb-1">Étymologie</label>
      <textarea
        id="etymology"
        v-model="etymology"
        rows="2"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      ></textarea>
    </div>

    <div>
      <label for="pronunciation" class="block text-sm font-medium text-gray-700 mb-1">Prononciation</label>
      <input
        id="pronunciation"
        v-model="pronunciation"
        type="text"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <div>
      <label for="variants" class="block text-sm font-medium text-gray-700 mb-1">Variantes</label>
      <input
        id="variants"
        v-model="variants"
        type="text"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <div>
      <label for="present_in_regions" class="block text-sm font-medium text-gray-700 mb-1">Régions</label>
      <input
        id="present_in_regions"
        v-model="presentInRegions"
        type="text"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <div>
      <label for="source_identifier" class="block text-sm font-medium text-gray-700 mb-1">Source</label>
      <input
        id="source_identifier"
        v-model="sourceIdentifier"
        type="text"
        required
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <div>
      <label for="source_url" class="block text-sm font-medium text-gray-700 mb-1">URL de la source</label>
      <input
        id="source_url"
        v-model="sourceUrl"
        type="url"
        class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
      />
    </div>

    <p v-if="error" class="text-sm text-red-600">{{ error }}</p>

    <button
      type="submit"
      :disabled="loading"
      class="w-full cursor-pointer rounded-md bg-blue-900 text-white py-2 text-sm font-medium hover:bg-blue-950 disabled:opacity-50"
    >
      {{ loading ? 'Enregistrement...' : submitLabel }}
    </button>
  </form>
</template>
