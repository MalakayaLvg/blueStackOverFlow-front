<script setup>

import {onMounted, ref} from "vue";




</script>

<template>
<h2>Questions</h2>

  <div class="d-flex form-control " v-for="question in questions">
    <a href="">{{ question.title }}</a>
  </div>

</template>

<style scoped>

</style>