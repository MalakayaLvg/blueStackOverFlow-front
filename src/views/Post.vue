<script setup>
import {onMounted} from "vue";

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
  <div>
    <h1>Home</h1>
  </div>
</template>

<style scoped>

</style>