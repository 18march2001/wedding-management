<template>
  <div class="settings-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Website Content</h1>
        <p>Edit your website contact information</p>
      </div>
    </div>

    <!-- Tab Nav -->
    <div class="tab-nav">
      <button class="tab-btn tab-btn--active">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.59 5.59l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
        Contact
      </button>
    </div>

    <!-- Skeleton -->
    <div v-if="isLoading" class="card">
      <div class="card-header">
        <div class="skeleton skeleton--title" />
      </div>
      <div class="form-grid">
        <div v-for="n in 6" :key="n" class="field">
          <div class="skeleton skeleton--label" />
          <div class="skeleton skeleton--input" />
        </div>
      </div>
    </div>

    <!-- Contact Card -->
    <div v-else class="card">
      <div class="card-header">
        <h2>Contact Information</h2>
        <p>Update your studio's contact details shown on the website</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <!-- Row 1: Phone + WhatsApp -->
        <div class="form-grid">
          <div class="field">
            <label>Phone Number <span class="required">*</span></label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.phone_number }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.5a16 16 0 0 0 5.59 5.59l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z"/></svg>
              <input v-model="form.phone_number" type="tel" placeholder="+91 9000000000" />
            </div>
            <span v-if="errors.phone_number" class="field-error">{{ errors.phone_number }}</span>
          </div>

          <div class="field">
            <label>WhatsApp Number <span class="required">*</span></label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.whatsapp_number }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
              <input v-model="form.whatsapp_number" type="tel" placeholder="+91 9000000000" />
            </div>
            <span v-if="errors.whatsapp_number" class="field-error">{{ errors.whatsapp_number }}</span>
          </div>

          <!-- Row 2: Email + Address -->
          <div class="field">
            <label>Email Address <span class="required">*</span></label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.email }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <input v-model="form.email" type="email" placeholder="info@studio.com" />
            </div>
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>

          <div class="field">
            <label>Studio Address <span class="required">*</span></label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.address }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <input v-model="form.address" type="text" placeholder="Ahmedabad, Gujarat" />
            </div>
            <span v-if="errors.address" class="field-error">{{ errors.address }}</span>
          </div>

          <!-- Row 3: Business Hours + Facebook -->
          <div class="field">
            <label>Business Hours <span class="required">*</span></label>
            <div class="input-wrap" :class="{ 'input-wrap--error': errors.business_hours }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <input v-model="form.business_hours" type="text" placeholder="Mon–Sat: 9:00 AM – 7:00 PM" />
            </div>
            <span v-if="errors.business_hours" class="field-error">{{ errors.business_hours }}</span>
          </div>

          <div class="field">
            <label>Facebook URL</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <input v-model="form.facebook_url" type="url" placeholder="https://facebook.com/..." />
            </div>
          </div>

          <!-- Row 4: Instagram -->
          <div class="field">
            <label>Instagram URL</label>
            <div class="input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="15" height="15"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <input v-model="form.instagram_url" type="url" placeholder="https://instagram.com/..." />
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <button type="submit" class="btn btn-gold" :disabled="isSaving">
            <svg v-if="isSaving" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ isSaving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { contactService, type ContactSettings } from '@/services/contact.service'
import { useUiStore } from '@/stores'

const ui = useUiStore()
const isLoading = ref(true)
const isSaving = ref(false)

const form = reactive<ContactSettings>({
  phone_number: '',
  whatsapp_number: '',
  email: '',
  address: '',
  business_hours: '',
  facebook_url: '',
  instagram_url: '',
})

const errors = reactive<Partial<Record<keyof ContactSettings, string>>>({})

const validate = (): boolean => {
  Object.keys(errors).forEach((k) => delete errors[k as keyof ContactSettings])

  if (!form.phone_number.trim()) {
    errors.phone_number = 'Phone number is required.'
  } else if (form.phone_number.replace(/\D/g, '').length < 10) {
    errors.phone_number = 'Phone number must be at least 10 digits.'
  }

  if (!form.whatsapp_number.trim()) {
    errors.whatsapp_number = 'WhatsApp number is required.'
  } else if (form.whatsapp_number.replace(/\D/g, '').length < 10) {
    errors.whatsapp_number = 'WhatsApp number must be at least 10 digits.'
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.address.trim()) errors.address = 'Studio address is required.'
  if (!form.business_hours.trim()) errors.business_hours = 'Business hours are required.'

  return Object.keys(errors).length === 0
}

onMounted(async () => {
  try {
    const data = await contactService.get()
    Object.assign(form, {
      phone_number: data.phone_number ?? '',
      whatsapp_number: data.whatsapp_number ?? '',
      email: data.email ?? '',
      address: data.address ?? '',
      business_hours: data.business_hours ?? '',
      facebook_url: data.facebook_url ?? '',
      instagram_url: data.instagram_url ?? '',
    })
  } catch {
    ui.showError('Failed to load contact settings.')
  } finally {
    isLoading.value = false
  }
})

const handleSubmit = async () => {
  if (!validate()) return

  isSaving.value = true
  try {
    await contactService.update({ ...form })
    ui.showSuccess('Contact information updated successfully.')
  } catch (err: any) {
    const apiErrors = err?.errors
    if (apiErrors) {
      Object.keys(apiErrors).forEach((k) => {
        errors[k as keyof ContactSettings] = apiErrors[k][0]
      })
    } else {
      ui.showError(err?.message || 'Failed to update contact information.')
    }
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.settings-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header p {
  color: var(--muted);
  font-size: 13px;
  margin-top: 2px;
}

/* Tab Nav */
.tab-nav {
  border-bottom: 2px solid var(--border);
  display: flex;
  gap: 4px;
}

.tab-btn {
  align-items: center;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  border-radius: 0;
  color: var(--muted);
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  gap: 7px;
  margin-bottom: -2px;
  padding: 10px 16px;
  transition: all 150ms ease;
}

.tab-btn--active {
  border-bottom-color: var(--gold);
  color: var(--gold);
}

/* Card */
.card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  border-bottom: 1px solid var(--border);
  padding: 20px 24px;
}

.card-header h2 {
  font-size: 16px;
  font-weight: 600;
}

.card-header p {
  color: var(--muted);
  font-size: 13px;
  margin-top: 3px;
}

/* Form */
.form-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  padding: 24px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field label {
  color: var(--charcoal);
  font-size: 13px;
  font-weight: 500;
}

.required {
  color: var(--danger);
}

/* Input with icon */
.input-wrap {
  align-items: center;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  display: flex;
  gap: 10px;
  padding: 0 12px;
  transition: all 150ms ease;
}

.input-wrap:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 169, 110, 0.12);
}

.input-wrap--error {
  border-color: var(--danger);
}

.input-wrap--error:focus-within {
  box-shadow: 0 0 0 3px rgba(224, 92, 92, 0.12);
}

.input-wrap svg {
  color: var(--muted);
  flex-shrink: 0;
}

.input-wrap input {
  border: none;
  border-radius: 0;
  box-shadow: none;
  flex: 1;
  font-size: 13px;
  outline: none;
  padding: 10px 0;
}

.input-wrap input:focus {
  border: none;
  box-shadow: none;
  outline: none;
}

.field-error {
  color: var(--danger);
  font-size: 12px;
}

/* Skeleton */
.skeleton {
  animation: shimmer 1.4s ease infinite;
  background: linear-gradient(90deg, var(--ivory) 25%, var(--border) 50%, var(--ivory) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

.skeleton--title { height: 20px; width: 180px; }
.skeleton--label { height: 13px; margin-bottom: 4px; width: 100px; }
.skeleton--input { border-radius: var(--radius-sm); height: 40px; width: 100%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Footer */
.card-footer {
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
