import { ref } from 'vue'
import { supabase } from './supabase'

// État d'authentification partagé (singleton) entre tous les composants.
const user = ref(null)
const isReady = ref(false)

async function init() {
  const { data } = await supabase.auth.getSession()
  user.value = data.session?.user ?? null
  isReady.value = true

  supabase.auth.onAuthStateChange((_event, session) => {
    user.value = session?.user ?? null
  })
}

// Initialisation unique, quel que soit le nombre d'appels à useAuth().
let initPromise = null

export function useAuth() {
  if (!initPromise) {
    initPromise = init()
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return { user, isReady, signIn, signOut }
}
