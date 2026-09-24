<script setup>
defineProps({
  count: { type: Number, default: 0 },
  active: { type: Boolean, default: false },
})

const emit = defineEmits(['click'])
</script>

<template>
  <div class="mt-3 flex items-center gap-2 border-t border-gray-100 pt-2">
    <button
      type="button"
      @click="emit('click')"
      class="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium cursor-pointer"
      :class="active ? 'bg-blue-900 text-white' : 'bg-blue-100 text-gray-700 hover:bg-blue-200'"
      :title="active ? 'Éditer votre avis' : 'Ajouter un avis'"
    >
      👍
    </button>
    <span class="text-xs text-gray-500">{{ count }} avis</span>
  </div>
</template>
