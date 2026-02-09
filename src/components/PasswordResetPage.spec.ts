import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import PasswordResetPage from './PasswordResetPage.vue'
import { SsoProvider, RouteName } from '@/types/auth'

// Mock authService
vi.mock('@/services/authService', () => ({
  signInWithSso: vi.fn()
}))

import { signInWithSso } from '@/services/authService'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: RouteName.Login, component: { template: '<div />' } },
    { path: '/reset', name: RouteName.ResetPassword, component: { template: '<div />' } }
  ]
})

describe('PasswordResetPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    router.push('/')
  })

  function createWrapper() {
    return mount(PasswordResetPage, {
      global: {
        plugins: [
          createTestingPinia({ createSpy: vi.fn }),
          router
        ],
        stubs: {
          AppButton: {
            template: '<button @click="$emit(\'click\')" :disabled="disabled"><slot name="icon" />{{ text }}</button>',
            props: ['text', 'color', 'disabled']
          }
        }
      }
    })
  }

  it('renders the correct page title', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('Mot de passe oublié ?')
  })

  it('renders all SSO login buttons with correct labels', () => {
    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(3)
    expect(wrapper.text()).toContain('Continuer avec Google')
    expect(wrapper.text()).toContain('Continuer avec Apple')
    expect(wrapper.text()).toContain('Continuer avec Microsoft')
  })

  it('calls signInWithSso with SsoProvider.Google when Google button is clicked', async () => {
    vi.mocked(signInWithSso).mockResolvedValue({
      email: 'test@google.com',
      displayName: 'Test',
      provider: SsoProvider.Google
    })

    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    
    await buttons[0]?.trigger('click')
    await flushPromises()

    expect(signInWithSso).toHaveBeenCalledWith(SsoProvider.Google)
  })

  it('displays an error message if SSO login fails', async () => {
    vi.mocked(signInWithSso).mockRejectedValue(new Error('Login failed'))

    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    
    await buttons[0]?.trigger('click')
    await flushPromises()

    expect(wrapper.find('[role="alert"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Échec de la connexion')
  })

  it('navigates to the reset password page on successful SSO login', async () => {
    vi.mocked(signInWithSso).mockResolvedValue({
      email: 'test@google.com',
      displayName: 'Test',
      provider: SsoProvider.Google
    })

    const wrapper = createWrapper()
    const buttons = wrapper.findAll('button')
    
    await buttons[0]?.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.name).toBe(RouteName.ResetPassword)
  })

  it('renders the XpeApp logo image', () => {
    const wrapper = createWrapper()
    const logo = wrapper.find('img[alt="Logo XpeApp"]')
    expect(logo.exists()).toBe(true)
  })
})
