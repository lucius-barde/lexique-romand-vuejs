<script setup>
defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    required: true,
  },
  confirmLabel: {
    type: String,
    default: 'Confirmer',
  },
})

const emit = defineEmits(['confirm', 'cancel'])
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    @click.self="emit('cancel')"
  >
    <div class="w-full max-w-sm rounded-lg bg-white p-5 shadow-lg">
      <p class="text-sm text-gray-800">{{ message }}</p>
      <div class="mt-5 flex justify-end gap-2">
        <button
          type="button"
          @click="emit('cancel')"
          class="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer"
        >
          Annuler
        </button>
        <button
          type="button"
          @click="emit('confirm')"
          class="rounded-md bg-blue-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-950 cursor-pointer"
        >
          {{ confirmLabel }}
        </button>
      </div>
    </div>
  </div>
</template>
