<template>
  <div id="app" class="app-container">
    <RouterView />
    <ConfirmDialog />
    <ToastContainer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
}
</style>
