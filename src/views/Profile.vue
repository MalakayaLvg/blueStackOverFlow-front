<script setup>

import BackButton from "@/components/BackButton.vue";
</script>

<template>
  <BackButton />
<h1>My Profile</h1>
  <div class="d-flex flex-column form-control p-5">
    <h2 class="my-4">Username</h2>
    <div class="input-group w-50">
      <input class="form-control" value="oslynx">
      <button class="btn btn-outline-warning">edit</button>
    </div>
    <h2 class="my-4">Email</h2>
    <div class="input-group w-50">
      <input class="form-control" value="oslynx@mail.com">
      <button class="btn btn-outline-warning">edit</button>
    </div>
  </div>

</template>

<style scoped>

</style>