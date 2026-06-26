<template>
  <div class="inquiries-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Inquiries</h1>
        <p>View and manage website contact inquiries</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <input
        v-model="search"
        type="search"
        placeholder="Search by name, email or subject..."
        class="search-input"
        @input="onSearch"
      />
      <span class="total-label">{{ store.pagination.total }} total</span>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="store.isLoading" class="state-box">
        <svg class="animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        Loading...
      </div>
      <div v-else-if="store.error" class="state-box state-box--error">{{ store.error }}</div>
      <div v-else-if="!store.inquiries.length" class="state-box">No inquiries found.</div>

      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Subject</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(inquiry, i) in store.inquiries" :key="inquiry.id">
            <td class="col-num">{{ (store.pagination.currentPage - 1) * store.pagination.perPage + i + 1 }}</td>
            <td class="col-name">{{ inquiry.name }}</td>
            <td class="col-muted">{{ inquiry.email }}</td>
            <td class="col-muted">{{ inquiry.contact_number }}</td>
            <td class="col-subject">{{ inquiry.subject }}</td>
            <td class="col-muted">{{ formatDate(inquiry.created_at) }}</td>
            <td class="col-actions">
              <button class="icon-btn" title="View" @click="openDetail(inquiry)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(inquiry)">
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

    <!-- Detail Modal -->
    <div v-if="selected" class="modal-backdrop" @click.self="selected = null">
      <div class="modal">
        <div class="modal-header">
          <h2>Inquiry Detail</h2>
          <button class="close-btn" @click="selected = null">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">Name</span>
            <span class="detail-value">{{ selected.name }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Email</span>
            <span class="detail-value">{{ selected.email }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Contact Number</span>
            <span class="detail-value">{{ selected.contact_number }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Date</span>
            <span class="detail-value">{{ formatDate(selected.created_at) }}</span>
          </div>
          <div class="detail-item detail-item--full">
            <span class="detail-label">Subject</span>
            <span class="detail-value">{{ selected.subject }}</span>
          </div>
          <div class="detail-item detail-item--full">
            <span class="detail-label">Message</span>
            <p class="detail-message">{{ selected.message }}</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="selected = null">Close</button>
          <button class="btn btn-danger" @click="handleDelete(selected)">Delete</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useInquiryStore, useUiStore } from '@/stores'
import type { Inquiry } from '@/types'

const store = useInquiryStore()
const ui = useUiStore()

const search = ref('')
const selected = ref<Inquiry | null>(null)
let searchTimer: ReturnType<typeof setTimeout>

onMounted(() => store.fetchInquiries({ page: 1 }))

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.fetchInquiries({ page: 1, search: search.value }), 400)
}

const changePage = (page: number) => store.fetchInquiries({ page, search: search.value })

const openDetail = (inquiry: Inquiry) => (selected.value = inquiry)

const handleDelete = async (inquiry: Inquiry) => {
  const confirmed = await ui.confirm({
    title: 'Delete Inquiry?',
    message: `Inquiry from "${inquiry.name}" will be permanently deleted.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await store.deleteInquiry(inquiry.id)
    if (selected.value?.id === inquiry.id) selected.value = null
    ui.showSuccess('Inquiry deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete inquiry.')
  }
}
</script>

<style scoped>
.inquiries-page {
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
  max-width: 300px;
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
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 13px;
  gap: 10px;
  justify-content: center;
  padding: 48px;
}

.state-box--error { color: var(--danger); }

.col-num { color: var(--muted); font-size: 12px; width: 40px; }
.col-name { font-weight: 500; }
.col-subject { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-muted { color: var(--muted); font-size: 13px; }
.col-actions { display: flex; gap: 6px; width: 80px; }

.icon-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  cursor: pointer;
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
  backdrop-filter: blur(2px);
  background: rgba(0, 0, 0, 0.4);
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
  gap: 20px;
  margin: auto;
  max-width: 560px;
  padding: 28px;
  width: 100%;
}

.modal-header {
  align-items: center;
  display: flex;
  justify-content: space-between;
}

.modal-header h2 { font-size: 20px; }

.close-btn {
  align-items: center;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--muted);
  display: flex;
  height: 32px;
  justify-content: center;
  width: 32px;
}

.close-btn:hover { background: var(--ivory); color: var(--charcoal); }

.detail-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr 1fr;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item--full { grid-column: 1 / -1; }

.detail-label {
  color: var(--muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.detail-value {
  color: var(--charcoal);
  font-size: 14px;
  font-weight: 500;
}

.detail-message {
  background: var(--cream);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--charcoal);
  font-size: 13px;
  line-height: 1.6;
  padding: 12px;
  white-space: pre-wrap;
}

.modal-footer {
  border-top: 1px solid var(--border);
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding-top: 4px;
}
</style>
