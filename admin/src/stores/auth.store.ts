import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService, type LoginPayload } from '@/services/auth.service'
import type { User, UserPermission } from '@/types'

const TOKEN_KEY = 'acp_admin_token'
const TOKEN_EXPIRY_KEY = 'acp_admin_token_expiry'
const TOKEN_TTL_MS = 10080 * 60 * 1000 // 7 days

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const user = ref<User | null>(null)
  const permissions = ref<UserPermission[]>([])
  const isLoading = ref(false)
  const isBootstrapped = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => Boolean(token.value || user.value))
  const userInitials = computed(() => {
    if (!user.value?.name) return 'AC'
    return user.value.name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  })

  const isTokenExpired = () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    return expiry ? Date.now() > Number(expiry) : false
  }

  const setToken = (value: string | null) => {
    token.value = value
    if (value) {
      localStorage.setItem(TOKEN_KEY, value)
      localStorage.setItem(TOKEN_EXPIRY_KEY, String(Date.now() + TOKEN_TTL_MS))
      return
    }
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  }

  const setUser = (value: User | null) => {
    user.value = value
  }

  const login = async (payload: LoginPayload) => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.login(payload)
      setToken(response.token || response.access_token || null)
      setUser(response.user)
      isBootstrapped.value = true
      return response.user
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unable to sign in.'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const fetchMe = async () => {
    if (!token.value || isTokenExpired()) {
      setToken(null)
      setUser(null)
      isBootstrapped.value = true
      return null
    }

    isLoading.value = true
    error.value = null

    try {
      const currentUser = await authService.me()
      setUser(currentUser)
      return currentUser
    } catch (err) {
      setToken(null)
      setUser(null)
      error.value = err instanceof Error ? err.message : 'Session expired.'
      return null
    } finally {
      isLoading.value = false
      isBootstrapped.value = true
    }
  }

  const logout = async () => {
    try {
      if (token.value) {
        await authService.logout()
      }
    } finally {
      setToken(null)
      setUser(null)
      permissions.value = []
      isBootstrapped.value = true
    }
  }

  const hasPermission = (permission?: string) => {
    if (!permission) return true
    const role = user.value?.role?.toLowerCase()
    if (role === 'admin' || role === 'super_admin') return true
    return permissions.value.some((item) => item.id === permission)
  }

  return {
    token,
    user,
    permissions,
    isLoading,
    isBootstrapped,
    error,
    isAuthenticated,
    userInitials,
    login,
    fetchMe,
    logout,
    hasPermission,
  }
})
