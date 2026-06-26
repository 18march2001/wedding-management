<template>
  <div class="admin-shell">
    <SidebarNav />
    <div class="admin-main" :class="{ 'admin-main--expanded': ui.sidebarCollapsed }">
      <Topbar />
      <main class="admin-content">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import SidebarNav from '@/components/layout/SidebarNav.vue'
import Topbar from '@/components/layout/Topbar.vue'
import { useUiStore } from '@/stores'

const ui = useUiStore()
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
}

.admin-main {
  display: flex;
  flex-direction: column;
  margin-left: var(--sidebar-w);
  min-height: 100vh;
  transition: margin-left 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.admin-main--expanded {
  margin-left: var(--sidebar-collapsed);
}

.admin-content {
  flex: 1;
  padding: 28px;
}

@media (max-width: 780px) {
  .admin-main,
  .admin-main--expanded {
    margin-left: var(--sidebar-collapsed);
  }

  .admin-content {
    padding: 20px 16px;
  }
}
</style>
