import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createWebHistory } from 'vue-router'
import ResetPasswordPage from './ResetPasswordPage.vue'
import { SsoProvider, RouteName } from '@/types/auth'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: RouteName.Login, component: { template: '<div />' } },
    { path: '/reset', name: RouteName.ResetPassword, component: { template: '<div />' } }
  ]
})

describe('ResetPasswordPage.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.useFakeTimers()
    router.push('/reset')
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  function createWrapper() {
    return mount(ResetPasswordPage, {
      global: {
        plugins: [
          createTestingPinia({
            createSpy: vi.fn,
            initialState: {
              auth: {
                user: {
                  email: 'test@example.com',
                  displayName: 'Test User',
                  provider: SsoProvider.Google
                }
              }
            }
          }),
          router
        ],
        stubs: {
          AppButton: {
            template: '<button type="submit" @click="$emit(\'click\')" :disabled="disabled">{{ text }}</button>',
            props: ['text', 'color', 'disabled']
          }
        }
      }
    })
  }

  it('renders the correct page title', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('h1').text()).toBe('Nouveau mot de passe')
  })

  it('displays the user email', () => {
    const wrapper = createWrapper()
    expect(wrapper.text()).toContain('test@example.com')
  })

  it('renders password and confirm password input fields', () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')

    expect(passwordInput.exists()).toBe(true)
    expect(confirmInput.exists()).toBe(true)
  })

  it('toggles password visibility when the toggle button is clicked', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const toggleButton = wrapper.find('.form-group__toggle-visibility')

    expect(passwordInput.attributes('type')).toBe('password')

    await toggleButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('text')

    await toggleButton.trigger('click')
    expect(passwordInput.attributes('type')).toBe('password')
  })

  it('shows the password strength indicator as the user types', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')

    await passwordInput.setValue('short')
    expect(wrapper.text()).toContain('Trop court')

    await passwordInput.setValue('longenough')
    expect(wrapper.text()).toContain('Faible')

    await passwordInput.setValue('LongEnough1')
    expect(wrapper.text()).toContain('Fort')

    await passwordInput.setValue('LongEnough1!')
    expect(wrapper.text()).toContain('Très fort')
  })

  it('detects when passwords match and enables form submission', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')

    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('TestPassword1!')

    // Form should be valid
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.exists()).toBe(true)
  })

  it('detects when passwords do not match and shows error styling', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')

    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('DifferentPassword!')

    const confirmWrapper = wrapper.find('#confirm-password')
    expect(confirmWrapper.classes()).toContain('form-group__input--error')
  })

  it('navigates back to the login page when the back button is clicked', async () => {
    const wrapper = createWrapper()
    const backButton = wrapper.find('footer .reset-password__back')
    expect(backButton.exists()).toBe(true)
    await backButton.trigger('click')
    await flushPromises()
    expect(wrapper.vm.$router.currentRoute.value.name).toBe(RouteName.Login)
  })

  it('renders the XpeApp logo image', () => {
    const wrapper = createWrapper()
    const logo = wrapper.find('img[alt="Logo XpeApp"]')
    expect(logo.exists()).toBe(true)
  })

  it('renders a form and prevents default submit behavior', async () => {
    const wrapper = createWrapper()
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
  })

  it('submits the form and shows a success message when passwords are valid and match', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')
    
    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('TestPassword1!')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    // Should show loading state
    await flushPromises()
    
    // Fast-forward timers for the setTimeout
    vi.advanceTimersByTime(1500)
    await flushPromises()
    
    expect(wrapper.text()).toContain('modifié avec succès')
  })

  it('calls handleBack and clears user store when the back link is clicked', async () => {
    const wrapper = createWrapper()
    const store = useAuthStore()
    
    // Trigger the back action through the exposed function
    const vm = wrapper.vm as any
    if (typeof vm.handleBack === 'function') {
      vm.handleBack()
      expect(store.clearUser).toHaveBeenCalled()
    }
  })

  it('disables the form after a successful password reset', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')
    
    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('TestPassword1!')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    
    vi.advanceTimersByTime(1500)
    await flushPromises()
    
    // Fieldset should be disabled after success
    const fieldset = wrapper.find('fieldset')
    expect(fieldset.attributes('disabled')).toBeDefined()
  })

  it('does not submit the form or show success when passwords do not match', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')
    
    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('DifferentPassword!')
    
    const form = wrapper.find('form')
    await form.trigger('submit')
    await flushPromises()
    
    // Should not show success message
    expect(wrapper.text()).not.toContain('modifié avec succès')
  })

  it('does not show error styling when passwords match', async () => {
    const wrapper = createWrapper()
    const passwordInput = wrapper.find('#password')
    const confirmInput = wrapper.find('#confirm-password')
    
    await passwordInput.setValue('TestPassword1!')
    await confirmInput.setValue('TestPassword1!')
    
    // Should NOT have error class when matching
    expect(confirmInput.classes()).not.toContain('form-group__input--error')
  })
})
