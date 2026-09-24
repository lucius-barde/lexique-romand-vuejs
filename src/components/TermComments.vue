<script setup>
import { formatDateShort } from '../lib/terms'

defineProps({
  reviews: { type: Array, required: true },
})

const withComments = (reviews) => reviews.filter((r) => r.term_review_message)
</script>

<template>
  <div>
    <h3 class="text-sm font-semibold text-gray-900 mb-2">Commentaires</h3>

    <p v-if="withComments(reviews).length === 0" class="text-sm text-gray-400">
      Aucun commentaire pour ce terme pour le moment.
    </p>

    <ul v-else class="flex flex-col gap-3">
      <li
        v-for="review in withComments(reviews)"
        :key="review.id"
        class="rounded-md border border-gray-100 bg-gray-50 p-3"
      >
        <blockquote class="text-md text-gray-800 italic">"{{ review.term_review_message }}"</blockquote>
        <p class="mt-1 text-xs text-gray-400">
          {{ review.lexiqueromand_profiles?.pseudonyme ?? 'Utilisateur' }}
          · {{ formatDateShort(review.created) }}
        </p>
      </li>
    </ul>
  </div>
</template>
