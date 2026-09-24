<script setup>
import { RouterLink } from 'vue-router'
import { useAuth } from '../lib/useAuth'

const { user } = useAuth()
</script>

<template>
  <header style="">
    <div class="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
      <RouterLink to="/" class="flex items-center gap-2 text-white">
        <img id="logo" src="/logo.png" alt="Lexique Romand" class="h-8 w-8" />
        <span class="font-semibold">Lexique Romand</span>
      </RouterLink>
      <nav class="flex items-center gap-4 text-sm text-white">
        <RouterLink to="/lexique" class="hover:opacity-80">Lexique</RouterLink>
        <template v-if="user">
          <RouterLink to="/import" class="hover:opacity-80">Importer un terme</RouterLink>
          <RouterLink to="/term" class="hover:opacity-80">Ajouter un terme</RouterLink>
          <RouterLink to="/user/logout" class="hover:opacity-80">Déconnexion</RouterLink>
        </template>
        <RouterLink v-else to="/user/login" class="hover:opacity-80">Connexion</RouterLink>
      </nav>
    </div>
  </header>
</template>
