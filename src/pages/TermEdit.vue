<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../lib/useAuth'
import { getTerm, createTerm, updateTerm } from '../lib/terms'
import TermForm from '../components/TermForm.vue'

const props = defineProps({
  id: { type: String, default: null },
})

const { user, isReady } = useAuth()
const router = useRouter()

const isEditing = !!props.id

const term = ref(null)
const loadError = ref('')
const loading = ref(false)
const saveError = ref('')

onMounted(async () => {
  if (!isEditing) return
  try {
    term.value = await getTerm(props.id)
  } catch (err) {
    loadError.value = err.message || "Impossible de charger le terme."
  }
})

async function handleSubmit(values) {
  saveError.value = ''
  loading.value = true
  try {
    if (isEditing) {
      await updateTerm(props.id, values)
    } else {
      await createTerm({ ...values, author_id: user.value.id })
    }
    router.push('/lexique')
  } catch (err) {
    saveError.value = err.message || "Impossible d'enregistrer le terme."
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex-1 flex items-center justify-center p-4">
    <template v-if="isReady">
      <div v-if="!user" class="text-center text-gray-500">
        Veuillez vous connecter pour accéder à cette page.
      </div>

      <p v-else-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>

      <div v-else-if="!isEditing || term" class="w-full max-w-sm mx-auto flex flex-col gap-4">
        <h1 class="text-lg font-semibold text-gray-900 text-center">
          {{ isEditing ? 'Éditer le terme' : 'Ajouter un terme' }}
        </h1>
        <TermForm
          :initial-values="term ?? {}"
          :loading="loading"
          :error="saveError"
          :submit-label="isEditing ? 'Enregistrer' : 'Ajouter'"
          @submit="handleSubmit"
        />
      </div>

      <p v-else class="text-sm text-gray-500">Chargement...</p>
    </template>
  </main>
</template>
