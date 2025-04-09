<script setup>
import BackButton from "@/components/BackButton.vue";
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

const store = useStore();
const username = ref('');
const email = ref('');
const password = ref('');
const message = ref('');
const loading = ref(true);

onMounted(async () => {
  try {
    const token = store.state.token;

    const response = await axios.get('http://localhost:8000/api/profile/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data) {
      username.value = response.data.username || '';
      email.value = response.data.email || '';

      store.commit('setUser', response.data);
    }
  } catch (error) {
    message.value = 'Erreur lors du chargement du profil: ' + (error.response?.data?.message || error.message);
  } finally {
    loading.value = false;
  }
});

const updateProfile = async () => {
  try {
    const token = store.state.token;
    const response = await axios.put('http://localhost:8000/api/profile/edit/', {
      username: username.value,
      email: email.value,
      ...(password.value ? { password: password.value } : {})
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data) {
      store.commit('setUser', response.data);
      message.value = 'Profil mis à jour avec succès!';
      password.value = '';
    }
  } catch (error) {
    message.value = 'Erreur lors de la mise à jour du profil: ' + (error.response?.data?.message || error.message);
  }
};
</script>

<template>
  <BackButton />
  <h1>Mon Profil</h1>

  <div v-if="loading" class="text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Chargement...</span>
    </div>
  </div>

  <div v-else class="d-flex flex-column form-control p-5">
    <div v-if="message" class="alert" :class="message.includes('Erreur') ? 'alert-danger' : 'alert-success'">
      {{ message }}
    </div>

    <h2 class="my-4">Nom d'utilisateur</h2>
    <div class="input-group w-50">
      <input class="form-control" v-model="username">
      <button class="btn btn-outline-warning" @click="updateProfile">Modifier</button>
    </div>

    <h2 class="my-4">Email</h2>
    <div class="input-group w-50">
      <input class="form-control" v-model="email">
      <button class="btn btn-outline-warning" @click="updateProfile">Modifier</button>
    </div>

    <h2 class="my-4">Mot de passe</h2>
    <div class="input-group w-50">
      <input class="form-control" type="password" v-model="password" placeholder="Nouveau mot de passe">
      <button class="btn btn-outline-warning" @click="updateProfile">Modifier</button>
    </div>

    <button class="btn btn-primary mt-4 w-25" @click="updateProfile">
      Enregistrer les modifications
    </button>
  </div>
</template>

<style scoped>
.alert {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 4px;
}
</style>
