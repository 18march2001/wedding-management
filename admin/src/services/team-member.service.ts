import apiClient from '@/utils/axios'
import type { TeamMember, CreateTeamMemberPayload, UpdateTeamMemberPayload } from '@/types'
import type { PaginatedResponse } from '@/types'

export interface TeamMemberFilters {
  page?: number
  per_page?: number
  search?: string
}

export const teamMemberService = {
  getAll(filters?: TeamMemberFilters): Promise<PaginatedResponse<TeamMember>> {
    return apiClient.get('/team-members', { params: filters })
  },

  getById(id: number): Promise<TeamMember> {
    return apiClient.get(`/team-members/${id}`)
  },

  create(payload: CreateTeamMemberPayload): Promise<TeamMember> {
    return apiClient.post('/team-members', payload)
  },

  update(id: number, payload: UpdateTeamMemberPayload): Promise<TeamMember> {
    return apiClient.put(`/team-members/${id}`, payload)
  },

  delete(id: number): Promise<void> {
    return apiClient.delete(`/team-members/${id}`)
  },
}
