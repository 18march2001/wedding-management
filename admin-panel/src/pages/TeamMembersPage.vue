<template>
  <div class="team-members-page">

    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Team Members</h1>
        <p>Manage your team members</p>
      </div>
      <button class="btn btn-gold" @click="openModal()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        Add Member
      </button>
    </div>

    <!-- Toolbar -->
    <div class="toolbar">
      <input v-model="search" type="search" placeholder="Search team members..." class="search-input" @input="onSearch" />
      <span class="total-label">{{ store.pagination.total }} total</span>
    </div>

    <!-- Table -->
    <div class="table-card">
      <div v-if="store.isLoading" class="state-box">Loading...</div>
      <div v-else-if="store.error" class="state-box state-box--error">{{ store.error }}</div>
      <div v-else-if="!store.teamMembers.length" class="state-box">No team members found.</div>
      <table v-else>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Designation</th>
            <th>Description</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(member, i) in store.teamMembers" :key="member.id">
            <td class="col-num">{{ (store.pagination.currentPage - 1) * store.pagination.perPage + i + 1 }}</td>
            <td class="col-name">{{ member.name }}</td>
            <td class="col-designation">{{ member.designation }}</td>
            <td class="col-desc">{{ member.profile_description || '—' }}</td>
            <td class="col-muted">{{ formatDate(member.created_at) }}</td>
            <td class="col-actions">
              <button class="icon-btn" title="Edit" @click="openModal(member)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="15" height="15"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="icon-btn icon-btn--danger" title="Delete" @click="handleDelete(member)">
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
        <h2>{{ modal.editing ? 'Edit Member' : 'Add Member' }}</h2>

        <form @submit.prevent="handleSubmit">
          <div class="field">
            <label>Name <span class="required">*</span></label>
            <input v-model="form.name" type="text" placeholder="e.g. John Doe" required />
            <span v-if="formErrors.name" class="field-error">{{ formErrors.name }}</span>
          </div>

          <div class="field">
            <label>Designation <span class="required">*</span></label>
            <input v-model="form.designation" type="text" placeholder="e.g. Lead Photographer" required />
            <span v-if="formErrors.designation" class="field-error">{{ formErrors.designation }}</span>
          </div>

          <div class="field">
            <label>Profile Description <span class="optional">(optional)</span></label>
            <textarea v-model="form.profile_description" rows="4" placeholder="Brief bio or description..." />
            <span v-if="formErrors.profile_description" class="field-error">{{ formErrors.profile_description }}</span>
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
import { useTeamMemberStore, useUiStore } from '@/stores'
import type { TeamMember } from '@/types'

const store = useTeamMemberStore()
const ui = useUiStore()

const search = ref('')
let searchTimer: ReturnType<typeof setTimeout>

const modal = reactive({ open: false, editing: false, id: 0 })
const form = reactive({ name: '', designation: '', profile_description: '' })
const formErrors = reactive<Record<string, string>>({})
const submitError = ref('')
const isSubmitting = ref(false)

onMounted(() => store.fetchTeamMembers({ page: 1 }))

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const onSearch = () => {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.fetchTeamMembers({ page: 1, search: search.value }), 400)
}

const changePage = (page: number) => store.fetchTeamMembers({ page, search: search.value })

const openModal = (member?: TeamMember) => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''
  if (member) {
    modal.editing = true
    modal.id = member.id
    form.name = member.name
    form.designation = member.designation
    form.profile_description = member.profile_description ?? ''
  } else {
    modal.editing = false
    modal.id = 0
    form.name = ''
    form.designation = ''
    form.profile_description = ''
  }
  modal.open = true
}

const closeModal = () => { modal.open = false }

const handleSubmit = async () => {
  Object.keys(formErrors).forEach((k) => (formErrors[k] = ''))
  submitError.value = ''

  if (!form.name.trim()) { formErrors.name = 'Name is required.'; return }
  if (!form.designation.trim()) { formErrors.designation = 'Designation is required.'; return }

  isSubmitting.value = true
  try {
    const payload = {
      name: form.name.trim(),
      designation: form.designation.trim(),
      profile_description: form.profile_description.trim() || undefined,
    }
    if (modal.editing) {
      await store.updateTeamMember(modal.id, payload)
      ui.showSuccess('Team member updated successfully.')
    } else {
      await store.createTeamMember(payload)
      ui.showSuccess('Team member created successfully.')
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

const handleDelete = async (member: TeamMember) => {
  const confirmed = await ui.confirm({
    title: 'Delete Team Member?',
    message: `"${member.name}" will be permanently deleted.`,
    confirmText: 'Delete',
  })
  if (!confirmed) return
  try {
    await store.deleteTeamMember(member.id)
    ui.showSuccess('Team member deleted.')
  } catch (err: any) {
    ui.showError(err?.message || 'Failed to delete team member.')
  }
}
</script>

<style scoped>
.team-members-page {
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

.search-input { max-width: 280px; width: 100%; }
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
.col-name { font-weight: 500; min-width: 140px; }
.col-designation { font-size: 13px; min-width: 140px; }
.col-desc { color: var(--muted); font-size: 13px; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.col-muted { color: var(--muted); font-size: 13px; white-space: nowrap; }
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
.field input, .field textarea { width: 100%; }

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
