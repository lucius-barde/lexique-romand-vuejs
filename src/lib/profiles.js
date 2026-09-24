import { supabase } from './supabase'

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('lexiqueromand_profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function updateProfile(userId, values) {
  const { data, error } = await supabase
    .from('lexiqueromand_profiles')
    .update(values)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export function isAdmin(profile) {
  return profile?.role === 'admin'
}
