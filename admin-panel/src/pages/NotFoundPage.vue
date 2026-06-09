<template>
  <div class="not-found-page">
    <h1>404</h1>
    <p>Page not found</p>
    <RouterLink to="/">Back to Dashboard</RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.not-found-page {
  padding: 2rem;
  text-align: center;
}
</style>
