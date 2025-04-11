<script setup>
import {onMounted, reactive, ref} from "vue";
import { createRouter as $router} from "vue-router";
import router from "@/router/index.js";
import NewPostButton from "@/components/NewPostButton.vue";
import SearchBar from "@/components/SearchBar.vue";

const questions = ref([]);
const allQuestions = ref([]);
const isSearching = ref(false);

const fetchPosts = () => {
  fetch("https://back-bluestackover.malakayalauvergnat.com/api/questions")
      .then(res => res.json())
      .then(data => {
        questions.value = data;
        allQuestions.value = [...data];
      })
      .catch(err => console.log(err.message));
};

onMounted(() => {
  fetchPosts();
});

const handlePostCreated = (newPost) => {
  questions.value.unshift(newPost);
  allQuestions.value.unshift(newPost);
  fetchPosts();
};

const handleSearch = (query) => {
  if (!query.trim()) {
    questions.value = [...allQuestions.value];
    isSearching.value = false;
    return;
  }

  isSearching.value = true;

  const lowercaseQuery = query.toLowerCase();
  questions.value = allQuestions.value.filter(question =>
      question.title.toLowerCase().includes(lowercaseQuery) ||
      question.body.toLowerCase().includes(lowercaseQuery)
  );
};
</script>

<template>
  <div class="container">
    <h1>Questions</h1>

    <div class="border-top border-end d-flex align-items-center">
      <NewPostButton @post-created="handlePostCreated"></NewPostButton>
      <SearchBar @search="handleSearch" />
    </div>

    <div v-if="isSearching && questions.length === 0" class="alert alert-info mt-3">
      Aucun résultat trouvé pour votre recherche.
    </div>

    <div class="border-top">
      <div v-for="(question, index) in questions" :key="index" class="form-control py-4 my-4 post" @click="router.push(`/post/${question.id}`)">
        <h3>{{ question.title }}</h3>
        <span class="text-muted">{{ question.author }}</span>
        <p>{{ question.body}}</p>
        <div class="d-flex align-items-center">
          <button class="btn btn-outline-success me-1">
            <i class="bi bi-arrow-up-circle"></i>
          </button>
          <span class="me-3">{{ question.upvotes }}</span>

          <button class="btn btn-outline-danger me-1">
            <i class="bi bi-arrow-down-circle"></i>
          </button>
          <span class="me-3">{{ question.downvotes }}</span>

          <button class="btn btn-outline-primary me-1">
            <i class="bi bi-chat"></i>
          </button>
          <span>{{ question.answers ? question.answers.length : 0 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.post{
  cursor: pointer;
}
.post:hover{
  background-color: #f8fcfd;
}
</style>
