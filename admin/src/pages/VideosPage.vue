<template>
  <div class="videos-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Videos</h1>
        <p>Manage wedding videos</p>
      </div>
      <button class="btn btn-gold" @click="openModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Video
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <input v-model="filters.search" type="search" placeholder="Search videos..." class="search-input" @input="onSearch" />
      <select v-model="filters.gallery_id" class="filter-select" @change="onFilterChange">
        <option :value="undefined">All Galleries</option>
        <option v-for="g in galleryStore.galleries" :key="g.id" :value="g.id">{{ g.title }}</option>
      </select>
      <span class="total-label">{{ store.pagination.total }} total</span>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="store.isLoading" class="state-box">Loading...</div>
      <div v-else-if="store.error" class="state-box state-box--error">{{ store.error }}</div>
      <div v-else-if="!store.videos.length" class="state-box">No videos found.</div>
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>URL</th>
            <th>Gallery</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(video, i) in store.videos" :key="video.id">
            <td class="col-num">{{ (store.pagination.currentPage - 1) * store.pagination.perPage + i + 1 }}</td>
            <td class="col-title">{{ video.title }}</td>
            <td class="col-url">
              <a :href="video.url" target="_blank" rel="noopener" class="url-link">
                {{ truncateUrl(video.url) }}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="11" height="11"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </td>
            <td class="col-muted">{{ video.gallery?.title || '—' }}</td>
            <td class="col-desc">{{ video.description || '—' }}</td>
            <td class="col-actions">
              <button class="icon-btn" title="Edit" @click="openModal(video)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(video)">
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
        <h2>{{ modal.editing ? 'Edit Video' : 'Add Video' }}</h2>

        <form @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="field">
            <label>Title <span class="required">*</span></label>
            <input v-model="form.title" type="text" placeholder="e.g. Sarah & John Highlights" required />
            <span v-if="formErrors.title" class="field-error">{{ formErrors.title }}</span>
          </div>

          <!-- URL -->
          <div class="field">
            <label>Video URL <span class="required">*</span></label>
            <input v-model="form.url" type="url" placeholder="https://youtube.com/watch?v=..." required />
            <span v-if="formErrors.url" class="field-error">{{ formErrors.url }}</span>
          </div>

          <!-- Gallery -->
          <div class="field">
            <label>Gallery <span class="optional">(optional)</span></label>
            <select v-model="form.gallery_id">
              <option :value="undefined">— None —</option>
              <option v-for="g in galleryStore.galleries" :key="g.id" :value="g.id">{{ g.title }}</option>
            </select>
          </div>

          <!-- Description -->
          <div class="field">
            <label>Description <span class="optional">(optional)</span></label>
            <textarea v-model="form.description" rows="3" placeholder="Short description..." />
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
import { useVideoStore, useGalleryStore, useUiStore } from '@/stores'
import type { Video } from '@/types'

const store = useVideoStore()
const galleryStore = useGalleryStore()
const ui = useUiStore()

const filters = reactive<{ search: string; gallery_id?: number }>({ search: '' })
let searchTimer: ReturnType<typeof setTimeout>

const modal = reactive({ open: false, editing: false, id: 0 })
const form = reactive({ title: '', url: '', description: '', gallery_id: undefined as number | undefined })
const formErrors = reactive<Record<string, string>>({})
const submitError = ref('')
const isSubmitting = ref(false)

onMounted(() => {
  store.fetchVideos({ page: 1 })
  galleryStore.fetchGalleries({ page: 1, per_page: 100 })
})

const truncateUrl = (url: string) => url.length > 40 ? url.slice(0, 40) + '...' : url

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.fetchVideos({ page: 1, search: filters.search, gallery_id: filters.gallery_id }), 400)
}

const onFilterChange = () => store.fetchVideos({ page: 1, search: filters.search, gallery_id: filters.gallery_id })

const changePage = (page: number) => store.fetchVideos({ page, search: filters.search, gallery_id: filters.gallery_id })

const openModal = (video?: Video) => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''
  if (video) {
    modal.editing = true
    modal.id = video.id
    form.title = video.title
    form.url = video.url
    form.description = video.description ?? ''
    form.gallery_id = video.gallery_id
  } else {
    modal.editing = false
    modal.id = 0
    form.title = ''
    form.url = ''
    form.description = ''
    form.gallery_id = undefined
  }
  modal.open = true
}

const closeModal = () => { modal.open = false }

const handleSubmit = async () => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''

  if (!form.title.trim()) { formErrors.title = 'Title is required.'; return }
  if (!form.url.trim()) { formErrors.url = 'URL is required.'; return }

  isSubmitting.value = true
  try {
    const payload = {
      title: form.title.trim(),
      url: form.url.trim(),
      description: form.description.trim() || undefined,
      gallery_id: form.gallery_id || undefined,
    }
    if (modal.editing) {
      await store.updateVideo(modal.id, payload)
      ui.showSuccess('Video updated successfully.')
    } else {
      await store.createVideo(payload)
      ui.showSuccess('Video created successfully.')
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

const handleDelete = async (video: Video) => {
  const confirmed = await ui.confirm({
    title: 'Delete Video?',
    message: `"${video.title}" will be permanently deleted.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await store.deleteVideo(video.id)
    ui.showSuccess('Video deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete video.')
  }
}
</script>

<style scoped>
.videos-page {
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

.search-input { max-width: 240px; width: 100%; }
.filter-select { max-width: 200px; width: 100%; }
.total-label { color: var(--muted); font-size: 13px; margin-left: auto; }

.table-card {
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.state-box { color: var(--muted); font-size: 13px; padding: 48px; text-align: center; }
.state-box--error { color: var(--danger); }

.col-num { color: var(--muted); font-size: 12px; width: 40px; }
.col-title { font-weight: 500; min-width: 160px; }
.col-url { min-width: 180px; }
.col-muted { color: var(--muted); font-size: 13px; }
.col-desc { color: var(--muted); font-size: 13px; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-actions { display: flex; gap: 6px; width: 80px; }

.url-link {
  align-items: center;
  color: var(--info);
  display: inline-flex;
  font-size: 12px;
  gap: 4px;
}

.url-link:hover { text-decoration: underline; }

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

.modal-backdrop {
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  inset: 0;
  justify-content: center;
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
  max-width: 480px;
  padding: 28px;
  width: 100%;
}

.modal h2 { font-size: 20px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 13px; font-weight: 500; }
.field input, .field select, .field textarea { width: 100%; }

.required { color: var(--danger); }
.optional { color: var(--muted); font-size: 11px; font-weight: 400; }
.field-error { color: var(--danger); font-size: 12px; }

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
