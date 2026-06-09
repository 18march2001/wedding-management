import { ref } from 'vue'
import { defineStore } from 'pinia'
import { teamMemberService, type TeamMemberFilters } from '@/services/team-member.service'
import type { TeamMember, CreateTeamMemberPayload, UpdateTeamMemberPayload } from '@/types'

export const useTeamMemberStore = defineStore('teamMember', () => {
  const teamMembers = ref<TeamMember[]>([])
  const pagination = ref({ currentPage: 1, lastPage: 1, total: 0, perPage: 10 })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  const fetchTeamMembers = async (filters: TeamMemberFilters = {}) => {
    isLoading.value = true
    error.value = null
    try {
      const res = await teamMemberService.getAll({
        page: filters.page ?? pagination.value.currentPage,
        per_page: pagination.value.perPage,
        ...filters,
      })
      teamMembers.value = res.data
      pagination.value = {
        currentPage: res.current_page,
        lastPage: res.last_page,
        total: res.total,
        perPage: res.per_page,
      }
    } catch (err: any) {
      error.value = err.message || 'Failed to load team members.'
    } finally {
      isLoading.value = false
    }
  }

  const createTeamMember = async (payload: CreateTeamMemberPayload) => {
    const created = await teamMemberService.create(payload)
    await fetchTeamMembers({ page: 1 })
    return created
  }

  const updateTeamMember = async (id: number, payload: UpdateTeamMemberPayload) => {
    const updated = await teamMemberService.update(id, payload)
    await fetchTeamMembers({ page: pagination.value.currentPage })
    return updated
  }

  const deleteTeamMember = async (id: number) => {
    await teamMemberService.delete(id)
    await fetchTeamMembers({ page: pagination.value.currentPage })
  }

  return {
    teamMembers,
    pagination,
    isLoading,
    error,
    fetchTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  }
})
