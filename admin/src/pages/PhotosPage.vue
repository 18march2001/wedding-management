<template>
  <div class="photos-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Photos</h1>
        <p>Manage gallery images</p>
      </div>
      <button v-if="selectedGalleryId" class="btn btn-gold" @click="openUpload">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Upload Photos
      </button>
    </div>

    <!-- Gallery Selector -->
    <div class="selector-bar">
      <select v-model="selectedGalleryId" class="gallery-select" @change="onGalleryChange">
        <option :value="null" disabled>Select a gallery…</option>
        <option v-for="g in galleryStore.galleries" :key="g.id" :value="g.id">
          {{ g.title }}
        </option>
      </select>
      <span v-if="selectedGalleryId" class="total-label">{{ galleryStore.images.length }} photos</span>
    </div>

    <!-- Empty state — no gallery selected -->
    <div v-if="!selectedGalleryId" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>Select a gallery to view and manage its photos</p>
    </div>

    <!-- Loading -->
    <div v-else-if="galleryStore.imagesLoading" class="empty-state">Loading...</div>

    <!-- Error -->
    <div v-else-if="galleryStore.imagesError" class="empty-state empty-state--error">{{ galleryStore.imagesError }}</div>

    <!-- No images -->
    <div v-else-if="!galleryStore.images.length" class="empty-state">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" width="48" height="48"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
      <p>No photos yet. Upload some!</p>
      <button class="btn btn-gold" @click="openUpload">Upload Photos</button>
    </div>

    <!-- Image Grid -->
    <div v-else class="image-grid">
      <div v-for="image in galleryStore.images" :key="image.id" class="image-card">
        <div class="image-wrap">
          <img :src="image.thumb_url" :alt="image.alt || ''" loading="lazy" />
          <div class="image-overlay">
            <a :href="image.url" target="_blank" class="overlay-btn" title="View full size">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <button class="overlay-btn overlay-btn--danger" title="Delete" @click="handleDelete(image)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Upload Modal -->
    <div v-if="uploadModal.open" class="modal-backdrop" @click.self="closeUpload">
      <div class="modal">
        <h2>Upload Photos</h2>

        <div
          class="drop-zone"
          :class="{ 'drop-zone--active': isDragging }"
          @click="triggerFileInput"
          @dragover.prevent="isDragging = true"
          @dragleave="isDragging = false"
          @drop.prevent="onDrop"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="36" height="36"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>
          <span>Click or drag photos here</span>
          <span class="drop-hint">JPG, PNG, WEBP — max 10MB each</span>
        </div>
        <input ref="fileInput" type="file" accept="image/jpeg,image/png,image/webp" multiple class="hidden-input" @change="onFileChange" />

        <!-- Preview Queue -->
        <div v-if="uploadQueue.length" class="preview-grid">
          <div v-for="(item, i) in uploadQueue" :key="i" class="preview-item">
            <img :src="item.preview" :alt="item.file.name" />
            <button class="preview-remove" @click="removeFromQueue(i)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div v-if="uploadError" class="submit-error">{{ uploadError }}</div>

        <!-- Upload Progress -->
        <div v-if="isUploading || isProcessing" class="progress-wrap">
          <div class="progress-labels">
            <span>{{ isProcessing ? 'Processing images…' : `Uploading… ${uploadPercent}%` }}</span>
            <span v-if="isProcessing" class="processing-hint">This may take a few seconds</span>
          </div>
          <div class="progress-track">
            <div
              class="progress-bar"
              :class="{ 'progress-bar--pulse': isProcessing }"
              :style="{ width: isProcessing ? '100%' : uploadPercent + '%' }"
            />
          </div>
          <div v-if="isProcessing" class="processing-steps">
            <span class="step" :class="{ 'step--done': processingStep >= 1 }">✓ Uploaded</span>
            <span class="step-arrow">→</span>
            <span class="step" :class="{ 'step--active': processingStep === 1, 'step--done': processingStep >= 2 }">Optimizing</span>
            <span class="step-arrow">→</span>
            <span class="step" :class="{ 'step--active': processingStep === 2, 'step--done': processingStep >= 3 }">Generating thumbnails</span>
            <span class="step-arrow">→</span>
            <span class="step" :class="{ 'step--active': processingStep === 3, 'step--done': processingStep >= 4 }">Done</span>
          </div>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn btn-outline" :disabled="isUploading || isProcessing" @click="closeUpload">Cancel</button>
          <button class="btn btn-gold" :disabled="!uploadQueue.length || isUploading || isProcessing" @click="handleUpload">
            {{ isUploading ? `Uploading… ${uploadPercent}%` : isProcessing ? 'Processing…' : `Upload ${uploadQueue.length || ''} Photo${uploadQueue.length !== 1 ? 's' : ''}` }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useGalleryStore, useUiStore } from '@/stores'
import type { GalleryImage } from '@/types'

const galleryStore = useGalleryStore()
const ui = useUiStore()

const selectedGalleryId = ref<number | null>(null)

onMounted(() => galleryStore.fetchGalleries({ page: 1, per_page: 100 }))

const onGalleryChange = () => {
  if (selectedGalleryId.value) galleryStore.fetchImages(selectedGalleryId.value)
}

// --- Delete ---
const handleDelete = async (image: GalleryImage) => {
  const confirmed = await ui.confirm({
    title: 'Delete Photo?',
    message: 'This photo will be permanently deleted.',
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await galleryStore.deleteImage(image.id)
    ui.showSuccess('Photo deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete photo.')
  }
}

// --- Upload ---
interface QueueItem { file: File; preview: string }

const uploadModal = reactive({ open: false })
const uploadQueue = ref<QueueItem[]>([])
const isDragging = ref(false)
const isUploading = ref(false)
const isProcessing = ref(false)
const uploadPercent = ref(0)
const processingStep = ref(0)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)
let pollTimer: ReturnType<typeof setInterval> | null = null
let stepTimer: ReturnType<typeof setInterval> | null = null

const stopTimers = () => {
  if (pollTimer) { clearInterval(pollTimer); pollTimer = null }
  if (stepTimer) { clearInterval(stepTimer); stepTimer = null }
}

onUnmounted(() => stopTimers())

const openUpload = () => {
  uploadQueue.value = []
  uploadError.value = ''
  uploadPercent.value = 0
  isProcessing.value = false
  processingStep.value = 0
  stopTimers()
  uploadModal.open = true
}

const closeUpload = () => {
  if (isUploading.value || isProcessing.value) return
  stopTimers()
  uploadModal.open = false
}

const triggerFileInput = () => fileInput.value?.click()

const addFiles = (files: FileList | File[]) => {
  Array.from(files).forEach((file) => {
    uploadQueue.value.push({ file, preview: URL.createObjectURL(file) })
  })
}

const onFileChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files) addFiles(files)
  if (fileInput.value) fileInput.value.value = ''
}

const onDrop = (e: DragEvent) => {
  isDragging.value = false
  if (e.dataTransfer?.files) addFiles(e.dataTransfer.files)
}

const removeFromQueue = (index: number) => {
  URL.revokeObjectURL(uploadQueue.value[index].preview)
  uploadQueue.value.splice(index, 1)
}

const handleUpload = async () => {
  if (!selectedGalleryId.value || !uploadQueue.value.length) return
  isUploading.value = true
  uploadPercent.value = 0
  uploadError.value = ''
  try {
    await galleryStore.uploadImages(
      selectedGalleryId.value,
      uploadQueue.value.map((q) => q.file),
      (percent) => { uploadPercent.value = percent }
    )
    // Switch to processing phase
    isUploading.value = false
    isProcessing.value = true
    processingStep.value = 1

    // Animate steps every 1.5s
    stepTimer = setInterval(() => {
      if (processingStep.value < 3) processingStep.value++
    }, 1500)

    // Poll every 2s to detect when images appear
    const countBefore = galleryStore.images.length
    pollTimer = setInterval(async () => {
      await galleryStore.fetchImages(selectedGalleryId.value!)
      if (galleryStore.images.length > countBefore) {
        stopTimers()
        processingStep.value = 4
        isProcessing.value = false
        ui.showSuccess('Photos uploaded and processed successfully.')
        setTimeout(() => { uploadModal.open = false }, 800)
      }
    }, 2000)
  } catch (err: any) {
    isUploading.value = false
    uploadError.value = err?.message || 'Upload failed.'
  }
}
</script>

<style scoped>
.photos-page {
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

.selector-bar {
  align-items: center;
  display: flex;
  gap: 12px;
}

.gallery-select { max-width: 320px; width: 100%; }
.total-label { color: var(--muted); font-size: 13px; }

.empty-state {
  align-items: center;
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 12px;
  padding: 80px 20px;
  text-align: center;
}

.empty-state--error { color: var(--danger); }

.image-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
}

.image-card { border-radius: var(--radius-sm); overflow: hidden; }

.image-wrap {
  aspect-ratio: 4/3;
  overflow: hidden;
  position: relative;
}

.image-wrap img {
  display: block;
  height: 100%;
  object-fit: cover;
  transition: transform 200ms;
  width: 100%;
}

.image-wrap:hover img { transform: scale(1.04); }

.image-overlay {
  align-items: center;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  gap: 8px;
  inset: 0;
  justify-content: center;
  opacity: 0;
  position: absolute;
  transition: opacity 150ms;
}

.image-wrap:hover .image-overlay { opacity: 1; }

.overlay-btn {
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  color: #fff;
  display: flex;
  height: 34px;
  justify-content: center;
  width: 34px;
}

.overlay-btn:hover { background: rgba(255, 255, 255, 0.28); }
.overlay-btn--danger:hover { background: rgba(220, 53, 69, 0.7); border-color: transparent; }

/* Upload Modal */
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
  max-width: 540px;
  padding: 28px;
  width: 100%;
}

.modal h2 { font-size: 20px; }

.drop-zone {
  align-items: center;
  border: 2px dashed var(--border);
  border-radius: var(--radius-sm);
  color: var(--muted);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-size: 13px;
  gap: 8px;
  padding: 36px 20px;
  text-align: center;
  transition: border-color 150ms, background 150ms;
}

.drop-zone--active,
.drop-zone:hover { background: var(--ivory); border-color: var(--gold); }
.drop-hint { font-size: 11px; }

.hidden-input { display: none; }

.preview-grid {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  max-height: 200px;
  overflow-y: auto;
}

.preview-item {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
}

.preview-item img {
  display: block;
  height: 100%;
  object-fit: cover;
  width: 100%;
}

.preview-remove {
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  border-radius: 50%;
  color: #fff;
  display: flex;
  height: 20px;
  justify-content: center;
  position: absolute;
  right: 4px;
  top: 4px;
  width: 20px;
}

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
}

.progress-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.progress-labels {
  align-items: center;
  display: flex;
  font-size: 13px;
  font-weight: 500;
  gap: 8px;
  justify-content: space-between;
}

.processing-hint {
  color: var(--muted);
  font-size: 11px;
  font-weight: 400;
}

.progress-track {
  background: var(--border);
  border-radius: 99px;
  height: 6px;
  overflow: hidden;
  width: 100%;
}

.progress-bar {
  background: var(--gold);
  border-radius: 99px;
  height: 100%;
  transition: width 200ms ease;
}

.progress-bar--pulse {
  animation: pulse-bar 1.5s ease-in-out infinite;
  width: 100% !important;
}

@keyframes pulse-bar {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.45; }
}

.processing-steps {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 11px;
  gap: 4px;
  margin-top: 2px;
}

.step {
  color: var(--muted);
  transition: color 300ms;
}

.step--active { color: var(--gold); font-weight: 600; }
.step--done { color: #22c55e; font-weight: 600; }

.step-arrow { color: var(--border); }
</style>
