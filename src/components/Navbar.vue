<script setup>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { computed } from "vue";

const store = useStore()
const router = useRouter()

const isLoggedIn = computed(() => store.getters.isLoggedIn)
const user = computed(() => store.getters.getUser)
console.log(user.value)

const logout = () => {
  store.dispatch('logout')
  router.push('/login')
}
</script>

<template>
  <nav class="navbar" style="background-color: #e3f2fd;">
    <div class="container">
      <a class="navbar-brand" href="/">BlueStackOverFlow</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div>
        <template v-if="!isLoggedIn">
          <a class="btn btn-primary me-2" href="/login">Login</a>
          <a class="btn btn-outline-primary me-2" href="/">Sign Up</a>
        </template>
        <template v-else>
          <span class="me-3">Bonjour, {{ user.username }}</span>
          <a class="btn btn-outline-primary me-2 rounded-circle" href="/profile"><i class="bi bi-person"></i></a>
          <button class="btn btn-danger" @click="logout">Déconnexion</button>
        </template>
      </div>

    </div>
  </nav>
</template>

<style scoped>

</style>