<script setup>
import {onMounted, reactive, ref} from "vue";
import { createRouter as $router} from "vue-router";
import router from "@/router/index.js";
import NewPostButton from "@/components/NewPostButton.vue";
import SearchBar from "@/components/SearchBar.vue";

const questions = ref([])

onMounted(() => {
  fetch("http://localhost:8000/api/questions")
      .then(res => res.json())
      .then(data => {
        questions.value = data
      })
      .catch(err => console.log(err.message))
})

</script>

<template>
  <div class="container">
    <h1>Questions</h1>

    <div class="border-top border-end d-flex align-items-center">
      <NewPostButton></NewPostButton>
      <SearchBar />
    </div>

    <div class="border-top">
      <div v-for="(question, index) in questions" :key="index" class="form-control py-4 my-4 post" @click="router.push(`/post/${question.id}`)">
        <h3>{{ question.title }}</h3>
        <span class="text-muted">{{ question.author }}</span>
        <p>{{ question.body}}</p>
        <button class="btn btn-outline-success me-2"><i class="bi bi-arrow-up-circle"></i></button>
        <button class="btn btn-outline-danger me-2"><i class="bi bi-arrow-down-circle"></i></button>
        <button class="btn btn-outline-primary me-2"><i class="bi bi-chat"></i></button>
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