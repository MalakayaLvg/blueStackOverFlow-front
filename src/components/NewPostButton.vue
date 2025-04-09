<script setup>

import { ref } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import router from "@/router/index.js";

const store = useStore()
const isModalOpen = ref(false)
const postContent = ref('')
const postTitle = ref('')
const isSubmitting = ref(false)
const error = ref(null)

const openModal = () => {
  isModalOpen.value = true
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  isModalOpen.value = false
  postContent.value = ''
  postTitle.value = ''
  error.value = null
  isSubmitting.value = false
  document.body.style.overflow = 'auto'
}

const submitPost = async () => {
  if (postTitle.value.trim() && postContent.value.trim()) {
    try {
      isSubmitting.value = true
      error.value = null

      const questionData = {
        title: postTitle.value.trim(),
        body: postContent.value.trim()
      }

      const response = await axios.post('http://localhost:8000/api/questions/', questionData)

      if (response.status === 201) {
        emit('post-created', response.data)
        closeModal()
      }
    } catch (err) {
      if (err.response?.status === 401) {
        error.value = "Votre session a expiré. Veuillez vous reconnecter."
        router.push('/login')
      } else {
        error.value = err.response?.data?.message || 'Une erreur est survenue'
      }
      console.error('Erreur lors de la soumission:', err)
    } finally {
      isSubmitting.value = false
    }
  }
}

const emit = defineEmits(['post-created'])

</script>

<template>
  <div class="my-4 me-4">
    <button @click="openModal" class="btn btn-primary d-flex align-items-center">
      <i class="bi bi-plus-circle fs-4 me-2"></i>new post
    </button>
  </div>

  <Teleport to="body">
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>Créer un nouveau post</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitPost">

            <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

            <textarea
                v-model="postTitle"
                placeholder="Your question title"
                class="post-textarea"
                rows="1"
            ></textarea>
            <hr>

            <textarea
                v-model="postContent"
                placeholder="your question description"
                class="post-textarea"
                rows="4"
            ></textarea>

            <div class="modal-actions">
              <button
                  type="submit"
                  class="btn btn-primary me-2"
                  :disabled="!postTitle.trim() || !postContent.trim() || isSubmitting"
              >
                <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-1"></span>
                {{ isSubmitting ? 'Envoi en cours...' : 'Poster' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  z-index: 1000;
}

.modal-container {
  background-color: white;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  padding: 12px 16px;
  border-bottom: 1px solid #e6ecf0;
  position: relative;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  margin-right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.modal-body {
  padding: 16px;
}

.post-textarea {
  width: 100%;
  border: none;
  resize: none;
  font-size: 18px;
  outline: none;
  margin-bottom: 16px;
  padding: 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-top: 1px solid #e6ecf0;
  padding-top: 12px;
}

</style>