import { supabase } from './supabase'

export const PAGE_SIZE = 50

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

// Formate une date ISO en "jj.mm.aaaa" (heure locale) pour un affichage compact.
export function formatDateShort(isoDate) {
  const d = new Date(isoDate)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()}`
}

export async function createTerm(values) {
  const { data, error } = await supabase
    .from('lexiqueromand_terms')
    .insert(values)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getTerm(id) {
  const { data, error } = await supabase
    .from('lexiqueromand_terms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function updateTerm(id, values) {
  const { data, error } = await supabase
    .from('lexiqueromand_terms')
    .update(values)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteTerm(id) {
  const { error } = await supabase.from('lexiqueromand_terms').delete().eq('id', id)
  if (error) throw error
}

// Liste paginée des termes, triés par date de modification décroissante.
// letter (optionnel) : filtre sur la première lettre du terme, tri alphabétique dans ce cas.
// Génère un identifiant HTML stable et compatible avec une URL.
// La normalisation Unicode est volontairement faite avant le remplacement des
// caractères : elle évite de perdre des lettres lors de la suppression des accents.
function normalizeAnchorPart(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function termAnchor(term) {
  const source = normalizeAnchorPart(term?.source_identifier)
  const value = normalizeAnchorPart(term?.term)
  return [source, value].filter(Boolean).join('--')
}

// URL propre de la page "single term", ex: /lexique/terme/topio/pive
// Réutilise la même normalisation que termAnchor, avec un slash entre les
// deux segments plutôt qu'un double tiret.
export function termUrl(term) {
  const source = normalizeAnchorPart(term?.source_identifier)
  const value = normalizeAnchorPart(term?.term)
  return `/lexique/terme/${source}/${value}`
}

// Retrouve un terme à partir des deux segments de son URL propre
// (/lexique/terme/:sourceSlug/:termSlug). Le slug du terme n'étant pas
// réversible (accents, ponctuation supprimés), on filtre côté serveur sur
// le premier "mot" du slug (le plus discriminant), puis on affine en JS en
// comparant les slugs normalisés de chaque terme candidat.
export async function getTermBySlug(sourceSlug, termSlug) {
  const firstWord = String(termSlug || '').split('-')[0]

  const { data, error } = await supabase
    .from('lexiqueromand_terms')
    .select('*')
    .ilike('term', `%${firstWord}%`)

  if (error) throw error

  const match = (data || []).find((t) => {
    return (
      normalizeAnchorPart(t.source_identifier) === sourceSlug &&
      normalizeAnchorPart(t.term) === termSlug
    )
  })

  return match ?? null
}

export function termLetter(term) {
  const normalized = normalizeAnchorPart(term?.term)
  return normalized.charAt(0) || 'a'
}

export async function searchTerms(searchTerm) {
  const value = String(searchTerm || '').trim()
  if (!value) return []

  const { data, error } = await supabase
    .from('lexiqueromand_terms')
    .select('*')
    .ilike('term', `%${value}%`)
    .order('term', { ascending: true })
    .limit(20)

  if (error) throw error
  return data || []
}

export async function listTerms({ page = 1, letter = null } = {}) {
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase.from('lexiqueromand_terms').select('*', { count: 'exact' })

  if (letter) {
    query = query.ilike('term', `${letter}%`)
    query = query.order('term', { ascending: true })
  } else {
    query = query.order('edited', { ascending: false })
  }

  const { data, error, count } = await query.range(from, to)

  if (error) throw error
  return { terms: data, total: count ?? 0 }
}
