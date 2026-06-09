<template>
  <div class="toast-stack" aria-live="polite" aria-atomic="false">
    <div
      v-for="notification in ui.notifications"
      :key="notification.id"
      class="toast"
      :class="`toast--${notification.type}`"
    >
      <div class="toast__icon">
        <span v-if="notification.type === 'success'">✓</span>
        <span v-else-if="notification.type === 'error'">!</span>
        <span v-else-if="notification.type === 'warning'">!</span>
        <span v-else>i</span>
      </div>
      <div class="toast__content">
        <strong>{{ notification.title }}</strong>
        <p>{{ notification.message }}</p>
      </div>
      <button class="toast__close" type="button" @click="ui.removeNotification(notification.id)">
        <span class="sr-only">Dismiss notification</span>
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores'

const ui = useUiStore()
</script>

<style scoped>
.toast-stack {
  bottom: 20px;
  display: grid;
  gap: 10px;
  position: fixed;
  right: 20px;
  width: min(360px, calc(100vw - 32px));
  z-index: 1150;
}

.toast {
  align-items: flex-start;
  background: var(--white);
  border: 1px solid var(--border);
  border-left: 4px solid var(--gold);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  gap: 12px;
  padding: 14px;
}

.toast--success {
  border-left-color: var(--success);
}

.toast--error {
  border-left-color: var(--danger);
}

.toast--warning {
  border-left-color: var(--warning);
}

.toast__icon {
  align-items: center;
  background: var(--ivory);
  border-radius: 50%;
  color: var(--charcoal);
  display: flex;
  flex: 0 0 28px;
  font-weight: 700;
  height: 28px;
  justify-content: center;
  width: 28px;
}

.toast__content {
  flex: 1;
}

.toast__content strong {
  display: block;
  font-size: 13px;
  margin-bottom: 2px;
}

.toast__content p {
  color: var(--muted);
  font-size: 12.5px;
  margin: 0;
}

.toast__close {
  background: transparent;
  color: var(--muted);
  font-size: 18px;
  line-height: 1;
  padding: 0 2px;
}
</style>
