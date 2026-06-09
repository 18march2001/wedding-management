import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ConfirmDialog, Modal, Notification } from '@/types'

export const useUiStore = defineStore('ui', () => {
  // State
  const storedSidebarState = localStorage.getItem('acp_sidebar_collapsed')
  const sidebarCollapsed = ref(storedSidebarState === 'true')
  const modals = ref<Record<string, Modal>>({})
  const notifications = ref<Notification[]>([])
  const confirmDialog = ref<ConfirmDialog>({
    isOpen: false,
    title: 'Confirm Action',
    message: '',
    size: 'sm',
  })
  const confirmResolver = ref<((confirmed: boolean) => void) | null>(null)

  // Computed
  const notificationCount = computed(() => notifications.value.length)

  // Sidebar
  const toggleSidebar = () => {
    sidebarCollapsed.value = !sidebarCollapsed.value
    localStorage.setItem('acp_sidebar_collapsed', String(sidebarCollapsed.value))
  }

  const setSidebarCollapsed = (collapsed: boolean) => {
    sidebarCollapsed.value = collapsed
    localStorage.setItem('acp_sidebar_collapsed', String(collapsed))
  }

  // Modals
  const openModal = (key: string, options: Partial<Modal> = {}) => {
    modals.value[key] = {
      isOpen: true,
      size: 'md',
      backdrop: true,
      ...options,
    }
  }

  const closeModal = (key: string) => {
    if (modals.value[key]) {
      modals.value[key].isOpen = false
    }
  }

  const isModalOpen = (key: string): boolean => {
    return modals.value[key]?.isOpen || false
  }

  // Notifications
  const addNotification = (notification: Omit<Notification, 'id'>): string => {
    const id = `notification-${Date.now()}`
    const fullNotification: Notification = {
      id,
      duration: 5000,
      ...notification,
    }

    notifications.value.push(fullNotification)

    if (fullNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, fullNotification.duration)
    }

    return id
  }

  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex((n) => n.id === id)
    if (index > -1) {
      notifications.value.splice(index, 1)
    }
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const confirm = (options: Partial<ConfirmDialog> & { message: string }) => {
    confirmDialog.value = {
      isOpen: true,
      title: 'Confirm Action',
      size: 'sm',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      ...options,
    }

    return new Promise<boolean>((resolve) => {
      confirmResolver.value = resolve
    })
  }

  const resolveConfirm = () => {
    confirmDialog.value.onConfirm?.()
    confirmResolver.value?.(true)
    confirmResolver.value = null
    confirmDialog.value.isOpen = false
  }

  const cancelConfirm = () => {
    confirmDialog.value.onCancel?.()
    confirmResolver.value?.(false)
    confirmResolver.value = null
    confirmDialog.value.isOpen = false
  }

  // Helper methods for notifications
  const showSuccess = (message: string, title: string = 'Success') => {
    return addNotification({
      title,
      message,
      type: 'success',
      duration: 5000,
    })
  }

  const showError = (message: string, title: string = 'Error') => {
    return addNotification({
      title,
      message,
      type: 'error',
      duration: 7000,
    })
  }

  const showWarning = (message: string, title: string = 'Warning') => {
    return addNotification({
      title,
      message,
      type: 'warning',
      duration: 5000,
    })
  }

  const showInfo = (message: string, title: string = 'Info') => {
    return addNotification({
      title,
      message,
      type: 'info',
      duration: 5000,
    })
  }

  return {
    // State
    sidebarCollapsed,
    modals,
    notifications,
    confirmDialog,
    // Computed
    notificationCount,
    // Methods
    toggleSidebar,
    setSidebarCollapsed,
    openModal,
    closeModal,
    isModalOpen,
    addNotification,
    removeNotification,
    clearNotifications,
    confirm,
    resolveConfirm,
    cancelConfirm,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  }
})
