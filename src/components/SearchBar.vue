<script setup>
import { ref } from 'vue';

const searchQuery = ref('');
const emit = defineEmits(['search']);

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const clearSearch = () => {
  searchQuery.value = '';
  emit('search', '');
};
</script>

<template>
  <div class="input-group ms-3">
    <input
        type="text"
        class="form-control"
        placeholder="Rechercher une question..."
        v-model="searchQuery"
        @keyup.enter="handleSearch"
    >
    <button
        class="btn btn-outline-primary"
        type="button"
        @click="handleSearch"
    >
      <i class="bi bi-search"></i>
    </button>
    <button
        v-if="searchQuery"
        class="btn btn-outline-secondary"
        type="button"
        @click="clearSearch"
    >
      <i class="bi bi-x"></i>
    </button>
  </div>
</template>

<style scoped>
.input-group {
  max-width: 400px;
}
</style>
