// Libellés des échelles utilisées dans le formulaire d'avis et l'affichage
// des statistiques d'un terme.

export const SELF_USAGE_LABELS = {
  1: 'Jamais',
  2: 'Rarement',
  3: 'Occasionnellement',
  4: 'Fréquemment',
  5: 'Très fréquemment',
}

export const PERCEIVED_USAGE_LABELS = {
  1: 'Jamais',
  2: 'Rarement',
  3: 'Occasionnellement',
  4: 'Fréquemment',
  5: 'Très fréquemment',
}

export const WRITTEN_USAGE_LABELS = {
  false: 'Oral uniquement',
  true: 'Écrit et oral',
}

export const PERCEIVED_CONTEXT_LABELS = {
  1: 'Disparu (inusité, archaïque, littéraire)',
  2: 'Vieillissant (personnes âgées uniquement)',
  3: 'Informel niche (cercle restreint, régionalisme)',
  4: 'Informel commun (compris par tous les Suisses)',
  5: 'Universel (oral, écrit, officiel)',
}

export function labelFor(labels, value) {
  return labels[value] ?? '—'
}
