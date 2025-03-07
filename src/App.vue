<script setup>
import Navbar from "@/components/Navbar.vue";
import { RouterView } from "vue-router"
import Header from "@/components/Header.vue";
</script>

<template>
  <Navbar></Navbar>
  <Header></Header>
  <RouterView></RouterView>
</template>

<style scoped>

</style>
