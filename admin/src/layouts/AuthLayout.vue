<template>
  <main class="auth-layout">
    <section class="auth-card">
      <div class="auth-brand">
        <div class="auth-brand__icon">A</div>
        <div>
          <strong>ACP Admin</strong>
          <span>Photography Studio</span>
        </div>
      </div>
      <RouterView />
    </section>
  </main>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style scoped>
.auth-layout {
  align-items: center;
  background: var(--cream);
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
}

.auth-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
  max-width: 420px;
  padding: 28px;
  width: 100%;
}

.auth-brand {
  align-items: center;
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 20px;
}

.auth-brand__icon {
  align-items: center;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  border-radius: 10px;
  color: var(--white);
  display: flex;
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 700;
  height: 44px;
  justify-content: center;
  width: 44px;
}

.auth-brand strong {
  display: block;
  font-family: var(--font-serif);
  font-size: 20px;
}

.auth-brand span {
  color: var(--muted);
  display: block;
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
</style>
