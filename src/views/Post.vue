<script setup>
import {onMounted, ref} from "vue";
import BackButton from "@/components/BackButton.vue";

const question = ref({})

onMounted(() => {
  fetch("http://localhost:8000/api/questions/2")
      .then(res => res.json())
      .then(data => {
        question.value = data
      })
      .catch(err => console.log(err.message))
})
</script>

<template>
  <BackButton />
  <div class="form-control my-5 py-3">
    <h2>{{ question.title }}</h2>
    <span class="text-muted">{{ question.author }}</span>
    <p>{{ question.body }}</p>
    <button class="btn btn-outline-success me-2"><i class="bi bi-arrow-up-circle"></i></button>
    <button class="btn btn-outline-danger me-2"><i class="bi bi-arrow-down-circle"></i></button>
    <div class="form-control my-5">
      <h3 class="my-3">Comments</h3>
      <form class="input-group" action="">
        <input class="form-control" type="text" placeholder="write your comment ...">
        <button class="btn btn-primary">send</button>
      </form>
      <div class="form-control my-4">
        <ul v-for="answer in question.answers">
          <li>
            <h4>{{ answer.author }}</h4>
            <p>{{ answer.body }}</p>
            <button class="btn btn-outline-success me-2"><i class="bi bi-arrow-up-circle"></i></button>
            <button class="btn btn-outline-danger me-2"><i class="bi bi-arrow-down-circle"></i></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>