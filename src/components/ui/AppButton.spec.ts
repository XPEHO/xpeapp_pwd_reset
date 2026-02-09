import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from './AppButton.vue'
import { ButtonColor } from '@/types/button'

describe('AppButton.vue', () => {
  it('renders the button text', () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Click me'
      }
    })

    expect(wrapper.text()).toContain('Click me')
  })

  it('applies the default red color class when no color is specified', () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Button'
      }
    })

    expect(wrapper.find('button').classes()).toContain('button-red')
  })

  it('applies the correct color class for each ButtonColor enum value', () => {
    const colors = [
      ButtonColor.Google,
      ButtonColor.Apple,
      ButtonColor.Microsoft,
      ButtonColor.Red,
      ButtonColor.White,
      ButtonColor.Green
    ]
    colors.forEach(color => {
      const wrapper = mount(AppButton, {
        props: {
          text: 'Button',
          color
        }
      })
      expect(wrapper.find('button').classes()).toContain(`button-${color}`)
    })
  })

  it('renders the button as disabled when the disabled prop is true', () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Button',
        disabled: true
      }
    })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('emits a click event when the button is clicked', async () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Button'
      }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('renders the icon slot content when provided', () => {
    const wrapper = mount(AppButton, {
      props: {
        text: 'Button'
      },
      slots: {
        icon: '<span class="test-icon">🔥</span>'
      }
    })

    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('supports all ButtonColor values and applies the correct class', () => {
    const colors = [
      ButtonColor.White,
      ButtonColor.Red,
      ButtonColor.Green,
      ButtonColor.Google,
      ButtonColor.Apple,
      ButtonColor.Microsoft
    ]
    colors.forEach((color) => {
      const wrapper = mount(AppButton, {
        props: {
          text: 'Button',
          color
        }
      })
      expect(wrapper.find('button').classes()).toContain(`button-${color}`)
    })
  })
})
