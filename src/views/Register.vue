<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import axios from "axios";
const router = useRouter()

const userData = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const loading = ref(false)
const error = ref(null)
const passwordMatch = ref(true)

const validateForm = () => {
  if (userData.password !== userData.confirmPassword) {
    passwordMatch.value = false
    return false
  }
  passwordMatch.value = true
  return true
}

const submitRegister = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = null

  try {
    const response = await axios.post('https://back-bluestackover.malakayalauvergnat.com/register/', {
      username: userData.username,
      email: userData.email,
      password: userData.password
    })

    if (response.status === 201) {
      router.push('/login')
    }
  } catch (err) {
    error.value = err.response?.data?.error || 'Une erreur est survenue. Veuillez réessayer.'
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <h1>Inscription</h1>

  <div class="d-flex justify-content-center">
    <form class="form-control w-50" @submit.prevent="submitRegister">
      <div class="mb-3">
        <label class="form-label" for="username">Nom d'utilisateur</label>
        <input
            class="form-control"
            type="text"
            id="username"
            v-model="userData.username"
            required
        />
      </div>

      <div class="mb-3">
        <label class="form-label" for="email">Email</label>
        <input
            class="form-control"
            type="email"
            id="email"
            v-model="userData.email"
            required
        />
      </div>

      <div class="mb-3">
        <label class="form-label" for="password">Mot de passe</label>
        <input
            class="form-control"
            type="password"
            id="password"
            v-model="userData.password"
            required
        />
      </div>

      <div class="mb-3">
        <label class="form-label" for="confirmPassword">Confirmer le mot de passe</label>
        <input
            class="form-control"
            type="password"
            id="confirmPassword"
            v-model="userData.confirmPassword"
            required
            :class="{ 'is-invalid': !passwordMatch }"
        />
        <div v-if="!passwordMatch" class="invalid-feedback">
          Les mots de passe ne correspondent pas
        </div>
      </div>

      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <button class="btn btn-primary my-3" type="submit" :disabled="loading">
        {{ loading ? 'Inscription en cours...' : 'S\'inscrire' }}
      </button>

      <div class="text-center mt-3">
        <p>Déjà inscrit ? <router-link to="/login">Se connecter</router-link></p>
      </div>
    </form>
  </div>
</template>

<style scoped>

</style>
