import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'
import PasswordResetPage from '@/components/PasswordResetPage.vue'
import ResetPasswordPage from '@/components/ResetPasswordPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.Login,
      component: PasswordResetPage
    },
    {
      path: '/reset',
      name: RouteName.ResetPassword,
      component: ResetPasswordPage,
      meta: { requiresAuth: true }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: { name: RouteName.Login }
    }
  ]
})

// Navigation guard pour protéger la page reset
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: RouteName.Login })
  } else {
    next()
  }
})

export default router
