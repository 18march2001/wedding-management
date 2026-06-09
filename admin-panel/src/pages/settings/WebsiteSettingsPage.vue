<template>
  <div class="website-settings-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Website Settings</h1>
        <p>Manage website content and hero slider images</p>
      </div>
    </div>

    <!-- Skeleton -->
    <template v-if="store.isLoading">
      <div class="card">
        <div class="card-header">
          <div class="skeleton skeleton--title" />
        </div>
        <div class="card-body">
          <div class="skeleton skeleton--textarea" />
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          <div class="skeleton skeleton--title" />
        </div>
        <div class="card-body">
          <div class="skeleton skeleton--upload" />
        </div>
      </div>
    </template>

    <template v-else>
      <!-- Website Content Card -->
      <div class="card">
        <div class="card-header">
          <h2>Website Content</h2>
          <p>Rich content displayed on your website's main sections</p>
        </div>
        <div class="card-body">
          <div class="field">
            <label>Content</label>
            <textarea
              v-model="websiteContent"
              rows="10"
              placeholder="Enter your website content here..."
              class="content-textarea"
            />
          </div>
        </div>
        <div class="card-footer">
          <button class="btn btn-gold" :disabled="store.isSaving" @click="handleSaveContent">
            <svg v-if="store.isSaving" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            {{ store.isSaving ? 'Saving...' : 'Save Content' }}
          </button>
        </div>
      </div>

      <!-- Hero Slider Images Card -->
      <div class="card">
        <div class="card-header">
          <h2>Hero Slider Images</h2>
          <p>Upload images for the hero section slider on your website</p>
        </div>
        <div class="card-body">

          <!-- Upload Area -->
          <div
            class="upload-area"
            :class="{ 'upload-area--dragover': isDragging }"
            @click="triggerFileInput"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="onDrop"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>Click or drag &amp; drop images to upload</span>
            <span class="upload-hint">JPG, JPEG, PNG, WEBP — max 10MB each</span>
          </div>
          <input
            ref="fileInput"
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp"
            multiple
            class="hidden-input"
            @change="onFileChange"
          />

          <!-- Pending Previews -->
          <div v-if="pendingFiles.length" class="section-label">Ready to upload ({{ pendingFiles.length }})</div>
          <div v-if="pendingFiles.length" class="image-grid">
            <div v-for="(preview, i) in pendingPreviews" :key="i" class="image-item">
              <img :src="preview" alt="Preview" class="image-thumb" />
              <button class="delete-btn" title="Remove" @click.stop="removePending(i)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>
          <div v-if="pendingFiles.length" class="upload-actions">
            <button class="btn btn-outline" @click="clearPending">Cancel</button>
            <button class="btn btn-gold" :disabled="store.isUploading" @click="handleUpload">
              <svg v-if="store.isUploading" class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
              {{ store.isUploading ? 'Uploading...' : `Upload ${pendingFiles.length} Image${pendingFiles.length > 1 ? 's' : ''}` }}
            </button>
          </div>

          <!-- Existing Images -->
          <template v-if="store.heroSliderImages.length">
            <div class="section-label">Uploaded Images ({{ store.heroSliderImages.length }})</div>
            <div class="image-grid">
              <div v-for="image in store.heroSliderImages" :key="image.id" class="image-item">
                <img :src="image.url" :alt="`Slider image ${image.id}`" class="image-thumb" />
                <button class="delete-btn delete-btn--uploaded" title="Delete" @click="handleDeleteImage(image.id)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                </button>
              </div>
            </div>
          </template>

          <div v-else-if="!pendingFiles.length" class="empty-state">
            No slider images uploaded yet.
          </div>

        </div>
      </div>
    </template>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useWebsiteSettingsStore } from '@/stores/website-settings.store'
import { useUiStore } from '@/stores'

const store = useWebsiteSettingsStore()
const ui = useUiStore()

const websiteContent = ref('')
const pendingFiles = ref<File[]>([])
const pendingPreviews = ref<string[]>([])
const isDragging = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

onMounted(async () => {
  try {
    await store.fetchSettings()
    websiteContent.value = store.websiteContent
  } catch {
    ui.showError('Failed to load website settings.')
  }
})

const handleSaveContent = async () => {
  try {
    await store.updateWebsiteContent(websiteContent.value)
    ui.showSuccess('Website content updated successfully.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to update website content.')
  }
}

const triggerFileInput = () => fileInput.value?.click()

const addFiles = (files: FileList | null) => {
  if (!files) return
  Array.from(files).forEach((file) => {
    pendingFiles.value.push(file)
    pendingPreviews.value.push(URL.createObjectURL(file))
  })
}

const onFileChange = (e: Event) => {
  addFiles((e.target as HTMLInputElement).files)
  if (fileInput.value) fileInput.value.value = ''
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  addFiles(e.dataTransfer?.files ?? null)
}

const removePending = (index: number) => {
  URL.revokeObjectURL(pendingPreviews.value[index])
  pendingFiles.value.splice(index, 1)
  pendingPreviews.value.splice(index, 1)
}

const clearPending = () => {
  pendingPreviews.value.forEach((url) => URL.revokeObjectURL(url))
  pendingFiles.value = []
  pendingPreviews.value = []
}

const handleUpload = async () => {
  try {
    await store.uploadImages([...pendingFiles.value])
    clearPending()
    ui.showSuccess('Images uploaded successfully.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to upload images.')
  }
}

const handleDeleteImage = async (mediaId: number) => {
  const confirmed = await ui.confirm({
    title: 'Delete Image?',
    message: 'This image will be permanently deleted from the slider.',
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await store.deleteImage(mediaId)
    ui.showSuccess('Image deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete image.')
  }
}
</script>

<style scoped>
.website-settings-page {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header p {
  color: var(--muted);
  font-size: 13px;
  margin-top: 2px;
}

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

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.card-footer {
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: flex-end;
  padding: 16px 24px;
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

.content-textarea {
  min-height: 220px;
  resize: vertical;
  width: 100%;
}

/* Upload */
.upload-area {
  align-items: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  color: var(--muted);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 8px;
  justify-content: center;
  min-height: 120px;
  padding: 24px;
  transition: border-color 150ms, background 150ms;
}

.upload-area:hover,
.upload-area--dragover {
  background: var(--ivory);
  border-color: var(--gold);
  color: var(--charcoal);
}

.upload-hint {
  font-size: 11px;
}

.hidden-input {
  display: none;
}

/* Section label */
.section-label {
  color: var(--muted);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.06em;
  padding-top: 4px;
  text-transform: uppercase;
}

/* Image grid */
.image-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.image-item {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  position: relative;
}

.image-thumb {
  display: block;
  height: 90px;
  object-fit: cover;
  width: 100%;
}

.delete-btn {
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  border: none;
  border-radius: 50%;
  color: var(--white);
  cursor: pointer;
  display: flex;
  height: 22px;
  justify-content: center;
  opacity: 0;
  padding: 0;
  position: absolute;
  right: 6px;
  top: 6px;
  transition: opacity 150ms;
  width: 22px;
}

.image-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn--uploaded:hover {
  background: var(--danger);
}

/* Upload actions */
.upload-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

/* Empty state */
.empty-state {
  color: var(--muted);
  font-size: 13px;
  padding: 16px 0;
  text-align: center;
}

/* Skeleton */
.skeleton {
  animation: shimmer 1.4s ease infinite;
  background: linear-gradient(90deg, var(--ivory) 25%, var(--border) 50%, var(--ivory) 75%);
  background-size: 200% 100%;
  border-radius: 4px;
}

.skeleton--title { height: 20px; width: 180px; }
.skeleton--textarea { border-radius: var(--radius-sm); height: 220px; width: 100%; }
.skeleton--upload { border-radius: var(--radius-sm); height: 120px; width: 100%; }

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

@media (max-width: 640px) {
  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
  }
}
</style>
