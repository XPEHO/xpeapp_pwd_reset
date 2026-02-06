<script setup lang="ts">
export type ButtonColor = 'white' | 'red' | 'green' | 'google' | 'apple' | 'microsoft'

defineProps<{
  text: string
  color?: ButtonColor
  disabled?: boolean
}>()

defineEmits<{
  click: []
}>()
</script>

<template>
  <button 
    class="button-text-size" 
    :class="[`button-${color ?? 'red'}`]" 
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot name="icon"></slot>
    <p class="button-text">{{ text }}</p>
  </button>
</template>

<style scoped>
/* ========================================
   BUTTON BASE STYLES
======================================== */
.button-text-size {
  /* Layout */
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  /* Dimensions */
  width: 100%;
  height: 3rem;
  padding-inline: 1rem;

  /* Visual */
  border: 2px solid;
  border-radius: 1rem;

  /* Interaction */
  cursor: pointer;
  transition: all 0.1s ease;
}

.button-text-size:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* RED BUTTON VARIANT (XPEHO Primary) */
.button-red {
  background-color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary), #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, var(--color-primary), #000 15%);
}

.button-red:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-red .button-text {
  color: #ffffff;
}

/* WHITE BUTTON VARIANT */
.button-white {
  background-color: #ffffff;
  border-color: color-mix(in srgb, #ffffff, #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, #ffffff, #000 15%);
}

.button-white:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-white .button-text {
  color: #333333;
}

/* GREEN BUTTON VARIANT (XPEHO) */
.button-green {
  background-color: var(--color-primary);
  border-color: color-mix(in srgb, var(--color-primary), #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, var(--color-primary), #000 15%);
}

.button-green:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-green .button-text {
  color: #ffffff;
}

/* GOOGLE BUTTON VARIANT */
.button-google {
  background-color: var(--color-google);
  border-color: color-mix(in srgb, var(--color-google), #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, var(--color-google), #000 15%);
}

.button-google:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-google .button-text {
  color: #ffffff;
}

/* APPLE BUTTON VARIANT */
.button-apple {
  background-color: var(--color-apple);
  border-color: color-mix(in srgb, var(--color-apple), #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, var(--color-apple), #000 15%);
}

.button-apple:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-apple .button-text {
  color: #ffffff;
}

/* MICROSOFT BUTTON VARIANT */
.button-microsoft {
  background-color: var(--color-microsoft);
  border-color: color-mix(in srgb, var(--color-microsoft), #000 15%);
  box-shadow: 0 4px 0 0 color-mix(in srgb, var(--color-microsoft), #000 15%);
}

.button-microsoft:active:not(:disabled) {
  transform: translateY(4px);
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.15) !important;
}

.button-microsoft .button-text {
  color: #ffffff;
}

/* ========================================
   BUTTON TEXT STYLES
======================================== */
.button-text {
  /* Typography */
  font-family: "SF Pro Rounded", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;

  /* Reset */
  margin: 0;

  /* User interaction */
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>
