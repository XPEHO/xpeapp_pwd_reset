<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { signInWithSso } from '@/services/authService'
import { SsoProvider, RouteName } from '@/types/auth'
import AppButton, { type ButtonColor } from '@/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const isLoading = ref(false)
const errorMessage = ref('')

interface SsoButton {
  provider: SsoProvider
  label: string
  color: ButtonColor
}

const ssoButtons: SsoButton[] = [
  {
    provider: SsoProvider.Google,
    label: 'Continuer avec Google',
    color: 'google'
  },
  {
    provider: SsoProvider.Apple,
    label: 'Continuer avec Apple',
    color: 'apple'
  },
  {
    provider: SsoProvider.Microsoft,
    label: 'Continuer avec Microsoft',
    color: 'microsoft'
  }
]

async function handleSsoLogin(provider: SsoProvider): Promise<void> {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const user = await signInWithSso(provider)
    authStore.setUser(user)
    router.push({ name: RouteName.ResetPassword })
  } catch (error) {
    console.error('SSO login error:', error)
    errorMessage.value = 'Échec de la connexion. Veuillez réessayer.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="password-reset">
    <section class="password-reset__container">
      <header class="password-reset__header">
        <figure class="password-reset__logo-wrapper">
          <img
            src="@/assets/Logo/LogoXpeApp.svg"
            alt="Logo XpeApp"
            class="password-reset__logo"
          />
        </figure>

        <h1 class="password-reset__title">Mot de passe oublié ?</h1>

        <p class="password-reset__subtitle">
          Connectez-vous avec votre compte que vous utiliser sur XpeApp ! pour réinitialiser votre mot de passe
        </p>
      </header>

      <div 
        v-if="errorMessage" 
        class="password-reset__error"
        role="alert"
      >
        {{ errorMessage }}
      </div>

      <nav
        class="password-reset__sso-buttons"
        aria-label="Options de connexion SSO"
      >
        <AppButton
          v-for="button in ssoButtons"
          :key="button.provider"
          :text="button.label"
          :color="button.color"
          :disabled="isLoading"
          @click="handleSsoLogin(button.provider)"
        >
          <template #icon>
            <span
              :class="['sso-button__icon', `sso-button__icon--${button.provider}`]"
              aria-hidden="true"
            ></span>
          </template>
        </AppButton>
      </nav>

      <footer class="password-reset__footer">
        <p>
          Besoin d'aide ?
          <a
            href="mailto:theo.lbg18@gmail.com"
            class="password-reset__support-link"
          >
            Contactez le support
          </a>
        </p>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.password-reset {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--spacing-md);
}

.password-reset__container {
  width: 100%;
  max-width: 25rem;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.08);
}

.password-reset__header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.password-reset__error {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  font-size: var(--font-size-sm);
  text-align: center;
  margin-bottom: var(--spacing-md);
}

.password-reset__logo-wrapper {
  margin-bottom: var(--spacing-md);
}

.password-reset__logo {
  width: 5rem;
  height: 5rem;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.password-reset__title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: var(--spacing-xs);
}

.password-reset__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: 1.6;
}

.password-reset__sso-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.sso-button__icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Icônes SVG inline */
.sso-button__icon--google::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.sso-button__icon--apple::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.09,16.67C20.06,16.74 19.67,18.11 18.71,19.5M13,3.5C13.73,2.67 14.94,2.04 15.94,2C16.07,3.17 15.6,4.35 14.9,5.19C14.21,6.04 13.07,6.7 11.95,6.61C11.8,5.46 12.36,4.26 13,3.5Z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.sso-button__icon--microsoft::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M2,3H11V12H2V3M11,22H2V13H11V22M21,3V12H12V3H21M21,22H12V13H21V22Z'/%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.password-reset__footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
}

.password-reset__support-link {
  color: var(--color-primary);
  text-decoration: underline;
  transition: color 0.2s ease;
}

.password-reset__support-link:hover,
.password-reset__support-link:focus {
  color: var(--color-primary-hover);
}

/* Responsive - Safe area pour mobile */
@supports (padding: max(0px)) {
  .password-reset {
    padding-top: max(var(--spacing-md), env(safe-area-inset-top));
    padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
    padding-left: max(var(--spacing-md), env(safe-area-inset-left));
    padding-right: max(var(--spacing-md), env(safe-area-inset-right));
  }
}

/* Small screens */
@media (max-width: 30rem) {
  .password-reset__container {
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
  }

  .password-reset__title {
    font-size: var(--font-size-lg);
  }
}
</style>
