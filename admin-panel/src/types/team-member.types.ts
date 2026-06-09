export interface TeamMember {
  id: number
  name: string
  designation: string
  profile_description?: string
  created_at: string
}

export interface CreateTeamMemberPayload {
  name: string
  designation: string
  profile_description?: string
}

export interface UpdateTeamMemberPayload extends Partial<CreateTeamMemberPayload> {}
