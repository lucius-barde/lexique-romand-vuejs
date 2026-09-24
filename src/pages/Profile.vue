<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../lib/useAuth'
import { getProfile, updateProfile } from '../lib/profiles'
import { REGIONS } from '../lib/regions'

const { user, isReady } = useAuth()

const profile = ref(null)
const loading = ref(true)
const loadError = ref('')
const saving = ref(false)
const saveError = ref('')
const saveSuccess = ref(false)

const pseudonyme = ref('')
const region = ref('')
const description = ref('')

async function load() {
  if (!user.value) return
  loading.value = true
  loadError.value = ''
  try {
    profile.value = await getProfile(user.value.id)
    pseudonyme.value = profile.value?.pseudonyme ?? ''
    region.value = profile.value?.region ?? ''
    description.value = profile.value?.description ?? ''
  } catch (err) {
    loadError.value = err.message || 'Impossible de charger votre profil.'
  } finally {
    loading.value = false
  }
}

onMounted(load)

async function handleSubmit() {
  saving.value = true
  saveError.value = ''
  saveSuccess.value = false
  try {
    profile.value = await updateProfile(user.value.id, {
      pseudonyme: pseudonyme.value,
      region: region.value || null,
      description: description.value || null,
    })
    saveSuccess.value = true
  } catch (err) {
    saveError.value = err.message || "Impossible d'enregistrer votre profil."
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <main class="flex-1 flex items-start justify-center p-4">
    <template v-if="isReady">
      <div v-if="!user" class="text-center text-gray-500 mt-8">
        Veuillez vous connecter pour accéder à cette page.
      </div>

      <div v-else class="w-full max-w-sm mx-auto flex flex-col gap-4 mt-4">
        <h1 class="text-lg font-semibold text-gray-900 text-center">Mon profil</h1>

        <p v-if="loading" class="text-sm text-gray-500 text-center">Chargement...</p>
        <p v-else-if="loadError" class="text-sm text-red-600">{{ loadError }}</p>

        <form v-else @submit.prevent="handleSubmit" class="flex flex-col gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              :value="user.email"
              type="email"
              disabled
              class="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
          </div>

          <div>
            <label for="pseudonyme" class="block text-sm font-medium text-gray-700 mb-1">Pseudonyme</label>
            <input
              id="pseudonyme"
              v-model="pseudonyme"
              type="text"
              required
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div>
            <label for="region" class="block text-sm font-medium text-gray-700 mb-1">Région</label>
            <select
              id="region"
              v-model="region"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="">—</option>
              <option v-for="r in REGIONS" :key="r.code" :value="r.code">{{ r.label }}</option>
            </select>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="description"
              v-model="description"
              rows="3"
              class="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
            ></textarea>
          </div>

          <p v-if="saveError" class="text-sm text-red-600">{{ saveError }}</p>
          <p v-if="saveSuccess" class="text-sm text-green-600">Profil enregistré.</p>

          <button
            type="submit"
            :disabled="saving"
            class="w-full cursor-pointer rounded-md bg-blue-900 text-white py-2 text-sm font-medium hover:bg-blue-950 disabled:opacity-50"
          >
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </form>
      </div>
    </template>
  </main>
</template>
