import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Lexique from '../pages/Lexique.vue'
import TermEdit from '../pages/TermEdit.vue'
import TermSingle from '../pages/TermSingle.vue'
import Login from '../pages/Login.vue'
import Logout from '../pages/Logout.vue'
import Import from '../pages/Import.vue'
import Profile from '../pages/Profile.vue'
import { useAuth } from '../lib/useAuth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: Home },

    { path: '/lexique', name: 'lexique', component: Lexique },
    { path: '/lexique/top', name: 'lexique-top', component: Lexique, props: { top: true } },
    { path: '/lexique/page/:page', name: 'lexique-page', component: Lexique, props: true },
    { path: '/lexique/:letter', name: 'lexique-letter', component: Lexique, props: true },
    {
      path: '/lexique/:letter/page/:page',
      name: 'lexique-letter-page',
      component: Lexique,
      props: true,
    },

    { path: '/term', name: 'term-new', component: TermEdit },
    { path: '/term/:id/edit', name: 'term-edit', component: TermEdit, props: true },

    {
      path: '/lexique/terme/:source_identifier/:term',
      name: 'term-single',
      component: TermSingle,
      props: true,
    },

    { path: '/user/login', name: 'login', component: Login },
    { path: '/user/logout', name: 'logout', component: Logout },
    {
      path: '/user/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },

    {
      path: '/import',
      name: 'import',
      component: Import,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta.requiresAuth) return true

  const { user, isReady } = useAuth()

  // S'assure que l'état d'authentification est initialisé avant de décider.
  while (!isReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 10))
  }

  if (!user.value) {
    return { path: '/user/login' }
  }

  return true
})

export default router
