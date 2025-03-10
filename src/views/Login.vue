<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import store from '../store' // Import direct du store

const router = useRouter()

const credentials = reactive({
  username: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

const submitLogin = async () => {
  loading.value = true
  error.value = null

  try {
    const result = await store.dispatch('login', credentials)
    if (result) {
      router.push('/')
    } else {
      error.value = 'Échec de la connexion. Vérifiez vos identifiants.'
    }
  } catch (err) {
    error.value = 'Une erreur est survenue. Veuillez réessayer.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>

  <h1>Login</h1>

  <div class="d-flex justify-content-center">
    <form class="form-control w-50" @submit.prevent="submitLogin">
      <div class="mb-3">
        <label class="form-label" for="username">Username</label>
        <input
            class="form-control"
            type="text"
            id="username"
            v-model="credentials.username"
            required
        />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Mot de passe</label>
        <input
            class="form-control"
            type="password"
            id="password"
            v-model="credentials.password"
            required
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button class="btn btn-primary my-3" type="submit" :disabled="loading">
        {{ loading ? 'Connexion en cours...' : 'Se connecter' }}
      </button>
    </form>
  </div>
</template>

<style scoped>

</style>