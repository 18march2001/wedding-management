<template>
  <aside class="sidebar" :class="{ 'sidebar--collapsed': ui.sidebarCollapsed }">
    <RouterLink class="brand-block" to="/dashboard">
      <div class="brand-icon">A</div>
      <div v-if="!ui.sidebarCollapsed" class="brand-copy">
        <strong>ACP Admin</strong>
        <span>Photography Studio</span>
      </div>
    </RouterLink>

    <nav class="nav" aria-label="Admin navigation">
      <div v-for="group in navGroups" :key="group.label" class="nav-section">
        <div v-if="!ui.sidebarCollapsed" class="nav-label">{{ group.label }}</div>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          class="nav-item"
          :title="ui.sidebarCollapsed ? item.label : undefined"
          :to="item.to"
        >
          <span class="nav-icon" v-html="item.icon" />
          <span v-if="!ui.sidebarCollapsed">{{ item.label }}</span>
          <span v-if="item.badge && !ui.sidebarCollapsed" class="nav-badge">{{ item.badge }}</span>
        </RouterLink>
      </div>
    </nav>

    <div class="user-area">
      <div class="avatar">{{ auth.userInitials }}</div>
      <div v-if="!ui.sidebarCollapsed" class="user-info">
        <strong>{{ auth.user?.name || 'Anil Chauhan' }}</strong>
        <span>{{ roleLabel }}</span>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore, useUiStore } from '@/stores'

const ui = useUiStore()
const auth = useAuthStore()

const roleLabel = computed(() => {
  if (!auth.user?.role) return 'Super Admin'
  return auth.user.role
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
})

const icons = {
  dashboard:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/></svg>',
  galleries:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z"/></svg>',
  photos:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>',
  videos:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  categories:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/></svg>',
  testimonials:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  inquiries:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',
  users:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  settings:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  contacts:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.89.33 1.76.63 2.6a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.48-1.15a2 2 0 0 1 2.11-.45c.84.3 1.71.51 2.6.63A2 2 0 0 1 22 16.92z"/></svg>',
}

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: icons.dashboard }],
  },
  {
    label: 'Media Library',
    items: [
      { label: 'Galleries', to: '/galleries', icon: icons.galleries, badge: '12' },
      { label: 'Photos', to: '/photos', icon: icons.photos },
      { label: 'Videos', to: '/videos', icon: icons.videos },
      { label: 'Categories', to: '/categories', icon: icons.categories },
    ],
  },
  {
    label: 'Website',
    items: [
      { label: 'Testimonials', to: '/testimonials', icon: icons.testimonials },
      { label: 'Inquiries', to: '/inquiries', icon: icons.inquiries },
      { label: 'Website Settings', to: '/settings/website', icon: icons.settings },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Team Members', to: '/team-members', icon: icons.users },
      { label: 'Contact Details', to: '/contacts', icon: icons.contacts },
    ],
  },
]
</script>

<style scoped>
.sidebar {
  background: var(--charcoal);
  display: flex;
  flex-direction: column;
  height: 100vh;
  left: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
  width: var(--sidebar-w);
  z-index: 100;
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed);
}

.brand-block {
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 12px;
  min-height: 72px;
  padding: 20px;
}

.brand-icon,
.avatar {
  align-items: center;
  background: linear-gradient(135deg, var(--gold), var(--gold-dark));
  border-radius: 8px;
  color: var(--white);
  display: flex;
  flex-shrink: 0;
  font-family: var(--font-serif);
  font-weight: 700;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.brand-copy {
  display: grid;
  overflow: hidden;
}

.brand-copy strong {
  color: var(--white);
  font-family: var(--font-serif);
  font-size: 16px;
}

.brand-copy span {
  color: rgba(255, 255, 255, 0.45);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.nav {
  flex: 1;
  overflow-y: auto;
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 4px;
}

.nav-label {
  color: rgba(255, 255, 255, 0.3);
  font-size: 9px;
  letter-spacing: 0.12em;
  padding: 12px 20px 6px;
  text-transform: uppercase;
}

.nav-item {
  align-items: center;
  color: rgba(255, 255, 255, 0.62);
  display: flex;
  font-size: 13px;
  gap: 12px;
  margin: 2px 10px;
  min-height: 42px;
  padding: 0 10px;
  position: relative;
}

.nav-item:hover,
.nav-item.router-link-active {
  background: rgba(201, 169, 110, 0.12);
  color: var(--gold);
}

.nav-item.router-link-active::before {
  background: var(--gold);
  border-radius: 0 3px 3px 0;
  bottom: 6px;
  content: '';
  left: -10px;
  position: absolute;
  top: 6px;
  width: 3px;
}

.nav-icon {
  display: flex;
  flex: 0 0 18px;
}

.nav-icon :deep(svg) {
  height: 18px;
  width: 18px;
}

.nav-badge {
  background: var(--gold);
  border-radius: 20px;
  color: var(--charcoal);
  font-size: 10px;
  font-weight: 600;
  margin-left: auto;
  padding: 1px 7px;
}

.user-area {
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  gap: 12px;
  padding: 16px 20px;
}

.avatar {
  border-radius: 50%;
  font-size: 15px;
}

.user-info {
  display: grid;
  overflow: hidden;
}

.user-info strong {
  color: var(--white);
  font-size: 13px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-info span {
  color: rgba(255, 255, 255, 0.4);
  font-size: 11px;
}
</style>
