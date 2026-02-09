<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { RouteName } from '@/types/auth'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => password.value === confirmPassword.value)
const isFormValid = computed(() => 
  password.value.length >= 8 && 
  confirmPassword.value.length >= 8 && 
  passwordsMatch.value
)

const passwordStrength = computed(() => {
  const pwd = password.value
  if (pwd.length < 8) return { level: 0, text: 'Trop court' }
  
  let strength = 0
  if (/[a-z]/.test(pwd)) strength++
  if (/[A-Z]/.test(pwd)) strength++
  if (/[0-9]/.test(pwd)) strength++
  if (/[^a-zA-Z0-9]/.test(pwd)) strength++
  
  if (strength <= 1) return { level: 1, text: 'Faible' }
  if (strength === 2) return { level: 2, text: 'Moyen' }
  if (strength === 3) return { level: 3, text: 'Fort' }
  return { level: 4, text: 'Très fort' }
})

async function handleSubmit(): Promise<void> {
  if (!isFormValid.value) return
  
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    successMessage.value = 'Votre mot de passe a été modifié avec succès !'
    password.value = ''
    confirmPassword.value = ''
    
    setTimeout(() => {
      // TODO: Rediriger vers l'app ou la page de confirmation
      authStore.clearUser()
      router.push({ name: RouteName.Login })
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Une erreur est survenue. Veuillez réessayer.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function handleBack(): void {
  authStore.clearUser()
  router.push({ name: RouteName.Login })
}
</script>

<template>
  <main class="reset-password">
    <section class="reset-password__container">
      <header class="reset-password__header">
        <figure class="reset-password__logo-wrapper">
          <img
            src="@/assets/logo/LogoXpeApp.svg"
            alt="Logo XpeApp"
            class="reset-password__logo"
          />
        </figure>
        <h1 class="reset-password__title">Nouveau mot de passe</h1>
        <p class="reset-password__subtitle">
          Connecté en tant que <strong>{{ authStore.userEmail }}</strong>
        </p>
      </header>

      <form class="reset-password__form" @submit.prevent="handleSubmit">
        <div 
          v-if="successMessage" 
          class="reset-password__message reset-password__message--success"
          role="alert"
        >
          {{ successMessage }}
        </div>
        
        <div 
          v-if="errorMessage" 
          class="reset-password__message reset-password__message--error"
          role="alert"
        >
          {{ errorMessage }}
        </div>

        <fieldset class="reset-password__fieldset" :disabled="isLoading || !!successMessage">
          <div class="form-group">
            <label for="password" class="form-group__label">Nouveau mot de passe</label>
            <div class="form-group__input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="form-group__input"
                placeholder="Minimum 8 caractères"
                autocomplete="new-password"
                required
                minlength="8"
              />
              <button 
                type="button" 
                class="form-group__toggle-visibility"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              >
                <span v-if="showPassword" class="eye-icon eye-icon--open"></span>
                <span v-else class="eye-icon eye-icon--closed"></span>
              </button>
            </div>
            <div v-if="password.length > 0" class="password-strength">
              <div 
                class="password-strength__bar"
                :class="`password-strength__bar--level-${passwordStrength.level}`"
              ></div>
              <span class="password-strength__text">{{ passwordStrength.text }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-group__label">Confirmer le mot de passe</label>
            <div class="form-group__input-wrapper">
              <input
                id="confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                class="form-group__input"
                :class="{ 'form-group__input--error': confirmPassword && !passwordsMatch }"
                placeholder="Répétez le mot de passe"
                autocomplete="new-password"
                required
                minlength="8"
              />
              <button 
                type="button" 
                class="form-group__toggle-visibility"
                @click="showConfirmPassword = !showConfirmPassword"
                :aria-label="showConfirmPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
              >
                <span v-if="showConfirmPassword" class="eye-icon eye-icon--open"></span>
                <span v-else class="eye-icon eye-icon--closed"></span>
              </button>
            </div>
            <p v-if="confirmPassword && !passwordsMatch" class="form-group__error">
              Les mots de passe ne correspondent pas
            </p>
          </div>

          <AppButton
            :text="isLoading ? 'Chargement...' : 'Changer le mot de passe'"
            color="green"
            :disabled="!isFormValid || isLoading"
            @click="handleSubmit"
          />
        </fieldset>
      </form>

      <footer class="reset-password__footer">
        <button type="button" class="reset-password__back" @click="handleBack">
          ← Retour
        </button>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.reset-password {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding: var(--spacing-md);
}

.reset-password__container {
  width: 100%;
  max-width: 25rem;
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  box-shadow: 0 0.25rem 1.5rem rgba(0, 0, 0, 0.08);
}

.reset-password__header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.reset-password__logo-wrapper {
  margin-bottom: var(--spacing-md);
}

.reset-password__logo {
  width: 4rem;
  height: 4rem;
  display: block;
  margin: 0 auto;
  object-fit: contain;
}

.reset-password__title {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--color-text-dark);
  margin-bottom: var(--spacing-xs);
}

.reset-password__subtitle {
  font-size: var(--font-size-sm);
  color: var(--color-text-light);
  line-height: 1.6;
}

.reset-password__subtitle strong {
  color: var(--color-primary);
}

.reset-password__form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.reset-password__fieldset {
  border: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.reset-password__fieldset:disabled {
  opacity: 0.7;
}

.reset-password__message {
  padding: var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-sm);
  text-align: center;
}

.reset-password__message--success {
  background-color: rgba(160, 206, 78, 0.15);
  color: var(--color-primary-hover);
}

.reset-password__message--error {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group__label {
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-dark);
}

.form-group__input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-group__input {
  padding: var(--spacing-sm);
  padding-right: 3rem;
  border: 1px solid #ddd;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-base);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
}

.form-group__toggle-visibility {
  position: absolute;
  right: 0.75rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.eye-icon {
  width: 1.25rem;
  height: 1.25rem;
  display: block;
}

.eye-icon--open::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'%3E%3C/path%3E%3Ccircle cx='12' cy='12' r='3'%3E%3C/circle%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.eye-icon--closed::before {
  content: '';
  display: block;
  width: 1.25rem;
  height: 1.25rem;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'%3E%3C/path%3E%3Cline x1='1' y1='1' x2='23' y2='23'%3E%3C/line%3E%3C/svg%3E");
  background-size: contain;
  background-repeat: no-repeat;
}

.form-group__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(160, 206, 78, 0.25);
}

.form-group__input--error {
  border-color: #dc3545;
}

.form-group__input--error:focus {
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.form-group__error {
  font-size: var(--font-size-sm);
  color: #dc3545;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.password-strength__bar {
  flex: 1;
  height: 0.25rem;
  background-color: #eee;
  border-radius: 0.125rem;
  position: relative;
  overflow: hidden;
}

.password-strength__bar::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  border-radius: 0.125rem;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.password-strength__bar--level-0::after {
  width: 0;
}

.password-strength__bar--level-1::after {
  width: 25%;
  background-color: #dc3545;
}

.password-strength__bar--level-2::after {
  width: 50%;
  background-color: #ffc107;
}

.password-strength__bar--level-3::after {
  width: 75%;
  background-color: #28a745;
}

.password-strength__bar--level-4::after {
  width: 100%;
  background-color: var(--color-primary);
}

.password-strength__text {
  font-size: 0.75rem;
  color: var(--color-text-light);
  min-width: 4rem;
}

.reset-password__footer {
  margin-top: var(--spacing-lg);
  text-align: center;
}

.reset-password__back {
  background: none;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  transition: color 0.2s ease;
}

.reset-password__back:hover {
  color: var(--color-primary);
}

/* Responsive - Safe area pour mobile */
@supports (padding: max(0px)) {
  .reset-password {
    padding-top: max(var(--spacing-md), env(safe-area-inset-top));
    padding-bottom: max(var(--spacing-md), env(safe-area-inset-bottom));
    padding-left: max(var(--spacing-md), env(safe-area-inset-left));
    padding-right: max(var(--spacing-md), env(safe-area-inset-right));
  }
}

/* Small screens */
@media (max-width: 30rem) {
  .reset-password__container {
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
  }

  .reset-password__title {
    font-size: var(--font-size-lg);
  }
}
</style>
