<script setup>
import { regionLabel } from '../lib/regions'

const props = defineProps({
  stats: { type: Object, required: true },
})

function formatAvg(value) {
  if (value === null || value === undefined) return '—'
  return value.toFixed(1)
}
</script>

<template>
  <div>
    <h3 class="text-sm font-semibold text-gray-900 mb-2">Statistiques</h3>

    <p v-if="stats.count === 0" class="text-sm text-gray-400">
      Aucun avis pour ce terme pour le moment.
    </p>

    <dl v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
      <div>
        <dt class="text-gray-500 text-xs">Nombre d'avis</dt>
        <dd class="text-gray-900 font-medium">{{ stats.count }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 text-xs">Fréquence moyenne d'usage par les contributeurs (sur 5)</dt>
        <dd class="text-gray-900 font-medium">{{ formatAvg(stats.avgSelfUsage) }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 text-xs">Fréquence moyenne d'usage perçue en société (sur 5)</dt>
        <dd class="text-gray-900 font-medium">{{ formatAvg(stats.avgPerceivedUsage) }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 text-xs">Vivacité actuelle du terme (1: disparu, 5: usage universel)</dt>
        <dd class="text-gray-900 font-medium">{{ formatAvg(stats.avgPerceivedContext) }}</dd>
      </div>
      <div>
        <dt class="text-gray-500 text-xs">Écrit et oral</dt>
        <dd class="text-gray-900 font-medium">{{ formatAvg(stats.writtenUsagePercent) }} %</dd>
      </div>
      <div v-if="stats.regionCounts.length" class="sm:col-span-2">
        <dt class="text-gray-500 text-xs mb-1">Régions citées</dt>
        <dd class="flex flex-wrap gap-1.5">
          <span
            v-for="r in stats.regionCounts"
            :key="r.code"
            class="rounded-md bg-blue-100 text-gray-700 px-2 py-0.5 text-xs"
          >
            {{ r.code }} {{ r.count }}x
          </span>
        </dd>
      </div>
      <div><em>Des graphiques plus précis seront ajoutés prochainement.</em></div>
    </dl>
  </div>
</template>
