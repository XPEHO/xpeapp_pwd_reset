import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(null)
  const isAuthenticated = computed(() => user.value !== null)
  const userEmail = computed(() => user.value?.email ?? null)

  function setUser(authUser: AuthUser) {
    user.value = authUser
  }

  function clearUser() {
    user.value = null
  }

  return {
    user,
    isAuthenticated,
    userEmail,
    setUser,
    clearUser
  }
})
