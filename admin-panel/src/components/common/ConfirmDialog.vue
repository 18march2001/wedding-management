<template>
  <div v-if="ui.confirmDialog.isOpen" class="confirm-backdrop" @click.self="ui.cancelConfirm">
    <section class="confirm" role="dialog" aria-modal="true" :aria-labelledby="titleId">
      <div class="confirm__icon">!</div>
      <h2 :id="titleId">{{ ui.confirmDialog.title || 'Confirm Action' }}</h2>
      <p>{{ ui.confirmDialog.message }}</p>
      <div class="confirm__actions">
        <button class="btn btn-outline" type="button" @click="ui.cancelConfirm">
          {{ ui.confirmDialog.cancelText || 'Cancel' }}
        </button>
        <button class="btn btn-danger" type="button" @click="ui.resolveConfirm">
          {{ ui.confirmDialog.confirmText || 'Confirm' }}
        </button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue'
import { useUiStore } from '@/stores'

const ui = useUiStore()
const titleId = useId()
</script>

<style scoped>
.confirm-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  inset: 0;
  justify-content: center;
  padding: 20px;
  position: fixed;
  z-index: 1050;
}

.confirm {
  background: var(--white);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  max-width: 380px;
  padding: 32px;
  text-align: center;
  width: 100%;
}

.confirm__icon {
  align-items: center;
  background: #fff0f0;
  border-radius: 50%;
  color: var(--danger);
  display: flex;
  font-weight: 700;
  height: 56px;
  justify-content: center;
  margin: 0 auto 16px;
  width: 56px;
}

.confirm h2 {
  font-size: 22px;
  margin-bottom: 8px;
}

.confirm p {
  color: var(--muted);
  font-size: 13.5px;
  margin: 0 0 24px;
}

.confirm__actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}
</style>
