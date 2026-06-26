<template>
  <header class="topbar">
    <button class="topbar-btn" type="button" @click="ui.toggleSidebar">
      <span class="sr-only">Toggle sidebar</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6" />
        <line x1="3" y1="12" x2="21" y2="12" />
        <line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    </button>

    <div class="breadcrumb">
      <span>Admin</span>
      <span>/</span>
      <strong>{{ currentTitle }}</strong>
    </div>

    <div class="topbar__spacer" />

    <label class="topbar-search">
      <span class="sr-only">Search</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input type="search" placeholder="Search..." />
    </label>

    <button class="topbar-btn notif-dot" type="button">
      <span class="sr-only">Notifications</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    </button>

    <button class="profile-chip" type="button" @click="handleLogout">
      <span>{{ auth.userInitials }}</span>
      <strong>{{ auth.user?.name || 'Admin' }}</strong>
    </button>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore, useUiStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const ui = useUiStore()
const auth = useAuthStore()

const currentTitle = computed(() => String(route.meta.title || 'Dashboard'))

const handleLogout = async () => {
  const confirmed = await ui.confirm({
    title: 'Sign Out?',
    message: 'You will return to the admin login screen.',
    confirmText: 'Sign Out',
  })

  if (!confirmed) return

  await auth.logout()
  ui.showInfo('You have been signed out.', 'Signed Out')
  await router.push('/login')
}
</script>

<style scoped>
.topbar {
  align-items: center;
  background: var(--white);
  border-bottom: 1px solid var(--border);
  display: flex;
  gap: 14px;
  height: var(--topbar-h);
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.topbar-btn {
  align-items: center;
  background: var(--white);
  border: 1px solid var(--border);
  color: var(--muted);
  display: flex;
  height: 38px;
  justify-content: center;
  padding: 0;
  width: 38px;
}

.topbar-btn:hover {
  background: var(--ivory);
  color: var(--charcoal);
}

.topbar-btn svg {
  height: 17px;
  width: 17px;
}

.breadcrumb {
  align-items: center;
  color: var(--muted);
  display: flex;
  font-size: 12.5px;
  gap: 8px;
}

.breadcrumb strong {
  color: var(--charcoal);
  font-weight: 500;
}

.topbar__spacer {
  flex: 1;
}

.topbar-search {
  max-width: 220px;
  position: relative;
  width: 100%;
}

.topbar-search svg {
  color: var(--muted);
  height: 16px;
  left: 12px;
  pointer-events: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
}

.topbar-search input {
  border-radius: 8px;
  font-size: 13px;
  padding: 8px 12px 8px 36px;
  width: 100%;
}

.notif-dot {
  position: relative;
}

.notif-dot::after {
  background: var(--danger);
  border: 2px solid var(--white);
  border-radius: 50%;
  content: '';
  height: 7px;
  position: absolute;
  right: 8px;
  top: 8px;
  width: 7px;
}

.profile-chip {
  align-items: center;
  background: transparent;
  display: flex;
  gap: 8px;
  padding: 0;
}

.profile-chip span {
  align-items: center;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  border-radius: 50%;
  color: var(--white);
  display: flex;
  font-size: 11px;
  font-weight: 600;
  height: 30px;
  justify-content: center;
  width: 30px;
}

.profile-chip strong {
  color: var(--charcoal);
  font-size: 13px;
  font-weight: 500;
}

@media (max-width: 780px) {
  .topbar {
    padding: 0 16px;
  }

  .topbar-search,
  .profile-chip strong {
    display: none;
  }
}
</style>
