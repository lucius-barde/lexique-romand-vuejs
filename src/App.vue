<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <NavBar />
    <main class="flex-1 flex flex-col">
      <RouterView />
    </main>
    <footer class="bg-white text-center p-2 text-gray-600 text-xs">
        &copy; 2026 <a href="https://www.bardic.space" target="_blank" class="underline">Bardic.Space</a>
    </footer>
  </div>
</template>
