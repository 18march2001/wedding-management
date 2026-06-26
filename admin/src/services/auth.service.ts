import apiClient from '@/utils/axios'
import type { User } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  token?: string
  access_token?: string
  user: User
}

export const authService = {
  login(payload: LoginPayload): Promise<LoginResponse> {
    return apiClient.post<LoginResponse, LoginResponse>('/login', payload)
  },

  logout(): Promise<void> {
    return apiClient.post<void, void>('/logout')
  },

  me(): Promise<User> {
    return apiClient.get<User, User>('/me')
  },
}
