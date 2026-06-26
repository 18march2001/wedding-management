<template>
  <div>
    <div class="login-header">
      <h1>Welcome Back</h1>
      <p>Sign in to manage galleries, media, website content, and settings.</p>
    </div>

    <form class="login-form" @submit.prevent="handleSubmit">
      <label>
        <span>Email Address</span>
        <input v-model="form.email" type="email" autocomplete="email" required />
      </label>

      <label>
        <span>Password</span>
        <input v-model="form.password" type="password" autocomplete="current-password" required />
      </label>

      <p v-if="errorMessage" class="form-error">{{ errorMessage }}</p>

      <button class="btn btn-gold login-submit" type="submit" :disabled="auth.isLoading">
        {{ auth.isLoading ? 'Signing in...' : 'Sign In' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useUiStore } from '@/stores'

const auth = useAuthStore()
const ui = useUiStore()
const route = useRoute()
const router = useRouter()

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = computed(() => auth.error)

const handleSubmit = async () => {
  try {
    await auth.login(form)
    ui.showSuccess('Signed in successfully.')
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
    await router.push(redirect)
  } catch {
    ui.showError('Please check your email and password.', 'Sign In Failed')
  }
}
</script>

<style scoped>
.login-header {
  margin-bottom: 22px;
}

.login-header h1 {
  font-size: 28px;
  margin-bottom: 8px;
}

.login-header p {
  color: var(--muted);
  font-size: 13.5px;
  margin: 0;
}

.login-form {
  display: grid;
  gap: 16px;
}

.login-form label {
  display: grid;
  gap: 6px;
}

.login-form span {
  color: var(--charcoal);
  font-size: 12.5px;
  font-weight: 500;
}

.form-error {
  background: #fff0f0;
  border: 1px solid #fecaca;
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 12.5px;
  margin: 0;
  padding: 10px 12px;
}

.login-submit {
  justify-content: center;
  margin-top: 4px;
  width: 100%;
}
</style>
