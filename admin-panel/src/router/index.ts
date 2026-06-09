import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/',
    component: () => import('@/layouts/AuthLayout.vue'),
    meta: {
      guestOnly: true,
    },
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/auth/LoginPage.vue'),
        meta: {
          title: 'Login',
          guestOnly: true,
        },
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/pages/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
        },
      },
      {
        path: 'galleries',
        name: 'Galleries',
        component: () => import('@/pages/GalleriesPage.vue'),
        meta: { title: 'Gallery Management', requiresAuth: true },
      },
      {
        path: 'photos',
        name: 'Photos',
        component: () => import('@/pages/PhotosPage.vue'),
        meta: { title: 'Photo Management', requiresAuth: true },
      },
      {
        path: 'videos',
        name: 'Videos',
        component: () => import('@/pages/VideosPage.vue'),
        meta: { title: 'Video Management', requiresAuth: true },
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('@/pages/CategoriesPage.vue'),
        meta: { title: 'Categories', requiresAuth: true },
      },
      {
        path: 'testimonials',
        name: 'Testimonials',
        component: () => import('@/pages/TestimonialsPage.vue'),
        meta: { title: 'Testimonials', requiresAuth: true },
      },
      {
        path: 'team-members',
        name: 'TeamMembers',
        component: () => import('@/pages/TeamMembersPage.vue'),
        meta: { title: 'Team Members', requiresAuth: true },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/SettingsPage.vue'),
        meta: { title: 'Settings', requiresAuth: true },
      },
      {
        path: 'inquiries',
        name: 'Inquiries',
        component: () => import('@/pages/InquiriesPage.vue'),
        meta: { title: 'Inquiries', requiresAuth: true },
      },
      {
        path: 'settings/website',
        name: 'WebsiteSettings',
        component: () => import('@/pages/settings/WebsiteSettingsPage.vue'),
        meta: { title: 'Website Settings', requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: 'Not Found',
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Update page title based on route meta
router.beforeEach(async (to, _from, next) => {
  const auth = useAuthStore()
  const title = to.meta.title as string | undefined
  if (title) {
    document.title = `${title} - ${import.meta.env.VITE_APP_NAME}`
  }

  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const guestOnly = to.matched.some((record) => record.meta.guestOnly)

  if (auth.token && !auth.user && !auth.isBootstrapped) {
    await auth.fetchMe()
  }

  if (requiresAuth && !auth.isAuthenticated) {
    next({ path: '/login', query: { redirect: to.fullPath } })
    return
  }

  if (guestOnly && auth.isAuthenticated) {
    next('/dashboard')
    return
  }

  const requiredPermission = to.meta.permission as string | undefined
  if (requiresAuth && !auth.hasPermission(requiredPermission)) {
    next('/dashboard')
    return
  }

  next()
})

export default router
