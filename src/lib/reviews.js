import { supabase } from './supabase'

// Nombre d'avis liés à un terme (utilisé pour l'indicateur "pouce en l'air").
export async function getReviewCount(termId) {
  const { count, error } = await supabase
    .from('lexiqueromand_reviews')
    .select('id', { count: 'exact', head: true })
    .eq('term_id', termId)

  if (error) throw error
  return count ?? 0
}

// Récupère le nombre d'avis pour plusieurs termes en une seule requête.
// Retourne une Map<term_id, count>.
export async function getReviewCounts(termIds) {
  const counts = new Map()
  if (!termIds || termIds.length === 0) return counts

  const { data, error } = await supabase
    .from('lexiqueromand_reviews')
    .select('term_id')
    .in('term_id', termIds)

  if (error) throw error

  for (const row of data || []) {
    counts.set(row.term_id, (counts.get(row.term_id) ?? 0) + 1)
  }
  return counts
}

// L'avis de l'utilisateur courant pour un terme donné (ou null s'il n'en a pas laissé).
export async function getUserReviewForTerm(termId, userId) {
  if (!userId) return null

  const { data, error } = await supabase
    .from('lexiqueromand_reviews')
    .select('*')
    .eq('term_id', termId)
    .eq('author_id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

// Tous les avis publics liés à un terme (pour les statistiques et les commentaires).
// Le pseudonyme de l'auteur est récupéré séparément : lexiqueromand_reviews et
// lexiqueromand_profiles référencent tous les deux auth.users, mais n'ont pas de
// clé étrangère directe entre eux, donc PostgREST ne peut pas faire le join en un
// seul appel .select() imbriqué.
export async function getReviewsForTerm(termId) {
  const { data, error } = await supabase
    .from('lexiqueromand_reviews')
    .select('*')
    .eq('term_id', termId)
    .order('created', { ascending: false })

  if (error) throw error
  const reviews = data || []

  const authorIds = [...new Set(reviews.map((r) => r.author_id))]
  if (authorIds.length === 0) return reviews

  const { data: profiles, error: profilesError } = await supabase
    .from('lexiqueromand_profiles')
    .select('id, pseudonyme')
    .in('id', authorIds)

  if (profilesError) throw profilesError

  const pseudonymeById = new Map((profiles || []).map((p) => [p.id, p.pseudonyme]))

  return reviews.map((r) => ({
    ...r,
    lexiqueromand_profiles: { pseudonyme: pseudonymeById.get(r.author_id) ?? null },
  }))
}

export async function createReview(values) {
  const { data, error } = await supabase
    .from('lexiqueromand_reviews')
    .insert(values)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateReview(id, values) {
  const { data, error } = await supabase
    .from('lexiqueromand_reviews')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteReview(id) {
  const { error } = await supabase.from('lexiqueromand_reviews').delete().eq('id', id)
  if (error) throw error
}

// Calcule des statistiques agrégées simples à partir d'une liste d'avis.
export function computeStats(reviews) {
  const count = reviews.length
  if (count === 0) {
    return {
      count: 0,
      avgSelfUsage: null,
      avgPerceivedUsage: null,
      avgPerceivedContext: null,
      writtenUsagePercent: null,
      regionCounts: [],
    }
  }

  const avg = (key) => reviews.reduce((sum, r) => sum + r[key], 0) / count
  const writtenCount = reviews.filter((r) => r.term_written_usage).length

  const regionTally = new Map()
  for (const review of reviews) {
    const regions = String(review.term_regions || '')
      .split(',')
      .map((r) => r.trim())
      .filter(Boolean)
    for (const region of regions) {
      regionTally.set(region, (regionTally.get(region) ?? 0) + 1)
    }
  }
  const regionCounts = [...regionTally.entries()]
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)

  return {
    count,
    avgSelfUsage: avg('term_self_usage'),
    avgPerceivedUsage: avg('term_perceived_usage'),
    avgPerceivedContext: avg('term_perceived_context'),
    writtenUsagePercent: (writtenCount / count) * 100,
    regionCounts,
  }
}
