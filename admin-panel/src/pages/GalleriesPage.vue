<template>
  <div class="galleries-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Galleries</h1>
        <p>Manage wedding photo galleries</p>
      </div>
      <button class="btn btn-gold" @click="openModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Gallery
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <input v-model="filters.search" type="search" placeholder="Search galleries..." class="search-input" @input="onSearch" />
      <select v-model="filters.gallery_category_id" class="filter-select" @change="onFilterChange">
        <option :value="undefined">All Categories</option>
        <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
      </select>
      <span class="total-label">{{ store.pagination.total }} total</span>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="store.isLoading" class="state-box">Loading...</div>
      <div v-else-if="store.error" class="state-box state-box--error">{{ store.error }}</div>
      <div v-else-if="!store.galleries.length" class="state-box">No galleries found.</div>
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Cover</th>
            <th>Title</th>
            <th>Category</th>
            <th>Location</th>
            <th>Event Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(gallery, i) in store.galleries" :key="gallery.id">
            <td class="col-num">{{ (store.pagination.currentPage - 1) * store.pagination.perPage + i + 1 }}</td>
            <td class="col-cover">
              <img v-if="gallery.cover_thumb_url" :src="gallery.cover_thumb_url" :alt="gallery.title" class="cover-thumb" />
              <div v-else class="cover-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="18" height="18"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </div>
            </td>
            <td class="col-title">{{ gallery.title }}</td>
            <td class="col-category">{{ gallery.category?.name || '—' }}</td>
            <td class="col-muted">{{ gallery.location || '—' }}</td>
            <td class="col-muted">{{ gallery.event_date ? formatDate(gallery.event_date) : '—' }}</td>
            <td class="col-actions">
              <button class="icon-btn" title="Edit" @click="openModal(gallery)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(gallery)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="store.pagination.lastPage > 1" class="pagination">
        <button class="btn btn-outline" :disabled="store.pagination.currentPage === 1" @click="changePage(store.pagination.currentPage - 1)">Prev</button>
        <span>Page {{ store.pagination.currentPage }} of {{ store.pagination.lastPage }}</span>
        <button class="btn btn-outline" :disabled="store.pagination.currentPage === store.pagination.lastPage" @click="changePage(store.pagination.currentPage + 1)">Next</button>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="modal.open" class="modal-backdrop" @click.self="closeModal">
      <div class="modal">
        <h2>{{ modal.editing ? 'Edit Gallery' : 'Add Gallery' }}</h2>

        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="field">
            <label>Title <span class="required">*</span></label>
            <input v-model="form.title" type="text" placeholder="e.g. Sarah & John Wedding" required />
            <span v-if="formErrors.title" class="field-error">{{ formErrors.title }}</span>
          </div>

          <!-- Category -->
          <div class="field">
            <label>Category <span class="required">*</span></label>
            <select v-model="form.gallery_category_id" required>
              <option :value="0" disabled>Select a category</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
            <span v-if="formErrors.gallery_category_id" class="field-error">{{ formErrors.gallery_category_id }}</span>
          </div>

          <div class="field-row">
            <!-- Location -->
            <div class="field">
              <label>Location</label>
              <input v-model="form.location" type="text" placeholder="e.g. Mumbai" />
            </div>

            <!-- Event Date -->
            <div class="field">
              <label>Event Date</label>
              <input v-model="form.event_date" type="date" />
            </div>
          </div>

          <!-- Cover Image -->
          <div class="field">
            <label>Cover Image {{ modal.editing ? '(leave empty to keep current)' : '*' }}</label>
            <div class="upload-area" @click="triggerFileInput" @dragover.prevent @drop.prevent="onFileDrop">
              <img v-if="imagePreview" :src="imagePreview" class="upload-preview" alt="Preview" />
              <div v-else-if="modal.editing && form.currentCoverUrl" class="upload-current">
                <img :src="form.currentCoverUrl" class="upload-preview" alt="Current cover" />
                <span class="upload-hint">Click to replace</span>
              </div>
              <div v-else class="upload-placeholder">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="28" height="28"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>Click or drag to upload</span>
                <span class="upload-hint">JPG, PNG, WEBP — max 10MB</span>
              </div>
            </div>
            <input ref="fileInput" type="file" accept="image/jpg,image/jpeg,image/png,image/webp" class="hidden-input" @change="onFileChange" />
            <span v-if="formErrors.cover_image" class="field-error">{{ formErrors.cover_image }}</span>
          </div>

          <div v-if="submitError" class="submit-error">{{ submitError }}</div>

          <div class="modal-actions">
            <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
            <button type="submit" class="btn btn-gold" :disabled="isSubmitting">
              {{ isSubmitting ? 'Saving...' : modal.editing ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useGalleryStore, useCategoryStore, useUiStore } from '@/stores'
import type { Gallery } from '@/types'

const store = useGalleryStore()
const categoryStore = useCategoryStore()
const ui = useUiStore()

const filters = reactive<{ search: string; gallery_category_id?: number }>({ search: '' })
let searchTimer: ReturnType<typeof setTimeout>

const modal = reactive({ open: false, editing: false, id: 0 })
const form = reactive({
  title: '',
  gallery_category_id: 0,
  location: '',
  event_date: '',
  cover_image: null as File | null,
  currentCoverUrl: '',
})
const formErrors = reactive<Record<string, string>>({})
const submitError = ref('')
const isSubmitting = ref(false)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  store.fetchGalleries({ page: 1 })
  categoryStore.fetchCategories(1, '')
})

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.fetchGalleries({ page: 1, search: filters.search, gallery_category_id: filters.gallery_category_id }), 400)
}

const onFilterChange = () => store.fetchGalleries({ page: 1, search: filters.search, gallery_category_id: filters.gallery_category_id })

const changePage = (page: number) => store.fetchGalleries({ page, search: filters.search, gallery_category_id: filters.gallery_category_id })

const triggerFileInput = () => fileInput.value?.click()

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  form.cover_image = file
  imagePreview.value = URL.createObjectURL(file)
}

const onFileDrop = (e: DragEvent) => {
  const file = e.dataTransfer?.files?.[0]
  if (!file) return
  form.cover_image = file
  imagePreview.value = URL.createObjectURL(file)
}

const openModal = (gallery?: Gallery) => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''
  imagePreview.value = null
  if (gallery) {
    modal.editing = true
    modal.id = gallery.id
    form.title = gallery.title
    form.gallery_category_id = gallery.gallery_category_id
    form.location = gallery.location ?? ''
    form.event_date = gallery.event_date ?? ''
    form.cover_image = null
    form.currentCoverUrl = gallery.cover_thumb_url ?? ''
  } else {
    modal.editing = false
    modal.id = 0
    form.title = ''
    form.gallery_category_id = 0
    form.location = ''
    form.event_date = ''
    form.cover_image = null
    form.currentCoverUrl = ''
  }
  modal.open = true
}

const closeModal = () => { modal.open = false }

const handleSubmit = async () => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''

  if (!form.title.trim()) { formErrors.title = 'Title is required.'; return }
  if (!form.gallery_category_id) { formErrors.gallery_category_id = 'Category is required.'; return }
  if (!modal.editing && !form.cover_image) { formErrors.cover_image = 'Cover image is required.'; return }

  isSubmitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      gallery_category_id: form.gallery_category_id,
      location: form.location.trim() || undefined,
      event_date: form.event_date || undefined,
      ...(form.cover_image ? { cover_image: form.cover_image } : {}),
    }

    if (modal.editing) {
      await store.updateGallery(modal.id, payload as any)
      ui.showSuccess('Gallery updated successfully.')
    } else {
      await store.createGallery(payload as any)
      ui.showSuccess('Gallery created successfully.')
    }
    closeModal()
  } catch (err: any) {
    const errors = err?.errors
    if (errors) {
      Object.keys(errors).forEach((k) => { formErrors[k] = errors[k][0] })
    } else {
      submitError.value = err?.message || 'Something went wrong.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleDelete = async (gallery: Gallery) => {
  const confirmed = await ui.confirm({
    title: 'Delete Gallery?',
    message: `"${gallery.title}" and all its images will be permanently deleted.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await store.deleteGallery(gallery.id)
    ui.showSuccess('Gallery deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete gallery.')
  }
}
</script>

<style scoped>
.galleries-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.page-header p {
  color: var(--muted);
  font-size: 13px;
  margin-top: 2px;
}

.toolbar {
  align-items: center;
  display: flex;
  gap: 12px;
}

.search-input {
  max-width: 240px;
  width: 100%;
}

.filter-select {
  max-width: 180px;
  width: 100%;
}

.total-label {
  color: var(--muted);
  font-size: 13px;
  margin-left: auto;
}

.table-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.state-box {
  color: var(--muted);
  font-size: 13px;
  padding: 48px;
  text-align: center;
}

.state-box--error { color: var(--danger); }

.col-num { color: var(--muted); font-size: 12px; width: 40px; }
.col-cover { width: 60px; }
.col-title { font-weight: 500; }
.col-category { color: var(--muted); font-size: 13px; }
.col-muted { color: var(--muted); font-size: 13px; }

.cover-thumb {
  border-radius: 6px;
  height: 40px;
  object-fit: cover;
  width: 56px;
}

.cover-placeholder {
  align-items: center;
  background: var(--ivory);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  display: flex;
  height: 40px;
  justify-content: center;
  width: 56px;
}

.col-actions { display: flex; gap: 6px; width: 80px; }

.icon-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  display: flex;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.icon-btn:hover { background: var(--ivory); color: var(--charcoal); }
.icon-btn--danger:hover { background: #fff0f0; border-color: var(--danger); color: var(--danger); }

.pagination {
  align-items: center;
  border-top: 1px solid var(--border);
  color: var(--muted);
  display: flex;
  font-size: 13px;
  gap: 12px;
  justify-content: center;
  padding: 14px 20px;
}

/* Modal */
.modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  inset: 0;
  justify-content: center;
  overflow-y: auto;
  padding: 20px;
  position: fixed;
  z-index: 200;
}

.modal {
  background: var(--white);
  border-radius: var(--radius);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: auto;
  max-width: 520px;
  padding: 28px;
  width: 100%;
}

.modal h2 { font-size: 20px; }

.field {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
}

.field-row {
  display: flex;
  gap: 12px;
}

.field label { font-size: 13px; font-weight: 500; }

.field input,
.field select,
.field textarea { width: 100%; }

.required { color: var(--danger); }
.field-error { color: var(--danger); font-size: 12px; }

.upload-area {
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
  min-height: 120px;
  overflow: hidden;
  position: relative;
  transition: border-color 150ms;
}

.upload-area:hover { border-color: var(--gold); }

.upload-preview {
  display: block;
  height: 160px;
  object-fit: cover;
  width: 100%;
}

.upload-placeholder,
.upload-current {
  align-items: center;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 6px;
  justify-content: center;
  min-height: 120px;
  padding: 16px;
}

.upload-hint { color: var(--muted); font-size: 11px; }

.hidden-input { display: none; }

.submit-error {
  background: #fff0f0;
  border: 1px solid #fcc;
  border-radius: var(--radius-sm);
  color: var(--danger);
  font-size: 13px;
  padding: 10px 14px;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
}
</style>
