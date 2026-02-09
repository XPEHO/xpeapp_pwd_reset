<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { signInWithSso } from '@/services/authService'
import { SsoProvider, RouteName } from '@/types/auth'
import AppButton from '@/components/ui/AppButton.vue'
import { ButtonColor } from '@/types/button'

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
    color: ButtonColor.Google
  },
  {
    provider: SsoProvider.Apple,
    label: 'Continuer avec Apple',
    color: ButtonColor.Apple
  },
  {
    provider: SsoProvider.Microsoft,
    label: 'Continuer avec Microsoft',
    color: ButtonColor.Microsoft
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
            src="@/assets/logo/LogoXpeApp.svg"
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
  background-color: var(--reset-error-bg, rgba(220, 53, 69, 0.1));
  color: var(--reset-error-text, #dc3545);
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
  color: var(--reset-title-text, var(--color-text-dark));
  margin-bottom: var(--spacing-xs);
}

.password-reset__subtitle {
  font-size: var(--font-size-sm);
  color: var(--reset-subtitle-text, var(--color-text-light));
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
  background-image: url('@/assets/svg/google.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.sso-button__icon--apple::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url('@/assets/svg/apple.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.sso-button__icon--microsoft::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url('@/assets/svg/microsoft.svg');
  background-size: contain;
  background-repeat: no-repeat;
}

.password-reset__footer {
  margin-top: var(--spacing-lg);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--reset-footer-text, var(--color-text-light));
}

.password-reset__support-link {
  color: var(--reset-support-link, var(--color-primary));
  text-decoration: underline;
  transition: color 0.2s ease;
}

.password-reset__support-link:hover,
.password-reset__support-link:focus {
  color: var(--reset-support-link-hover, var(--color-primary-hover));
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
