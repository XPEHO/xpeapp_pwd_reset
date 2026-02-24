import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from '@/types/auth'
import { signOut } from '@/services/authService'

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

  async function logout() {
    user.value = null;
    try {
      await signOut();
    } catch (error) {
      console.debug('Error disconnecting from Firebase:', error);
    }
  }

  return {
    user,
    isAuthenticated,
    userEmail,
    setUser,
    clearUser,
    logout
  }
})
