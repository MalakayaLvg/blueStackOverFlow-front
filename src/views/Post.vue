<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import BackButton from "@/components/BackButton.vue";
import router from "@/router/index.js";
import store from "@/store/index.js";

const route = useRoute()
const question = ref({})
const answers = ref([])
const id = ref(route.params.id)
const token = store.state.token
const isUpvoted = ref(false)
const isDownvoted = ref(false)
const answerBody = ref("")

const fetchPost = () => {
  fetch(`http://localhost:8000/api/questions/${id.value}/`,{
    method: 'GET'
  })
      .then(res => res.json())
      .then(data => {
        question.value = data
        answers.value = data.answers
        console.log(answers.value.length)
        console.log(question.value)
      })
      .catch(err => console.log(err.message))
}

const deletePost = () => {
  fetch(`http://localhost:8000/api/questions/${id.value}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
      .then(res => {
        console.log(res)
        router.push('/')
      })
      .catch(error => console.log(error))
}

const upVote = () => {
  fetch(`http://localhost:8000/api/questions/${id.value}/upvote/`,{
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(res => {
        console.log(res)
        isUpvoted.value = !isUpvoted.value

        if (isUpvoted.value) {
          isDownvoted.value = false
        }
      })
      .catch(error => console.log(error))
}

const downVote = () => {
  fetch(`http://localhost:8000/api/questions/${id.value}/downvote/`,{
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(res => {
        console.log(res)
        isDownvoted.value = !isDownvoted.value

        if (isDownvoted.value) {
          isUpvoted.value = false
        }
      })
      .catch(error => console.log(error))
}
const answerPost = () => {
  console.log(answerBody.value)
  const body = {
    question: id.value,
    body: answerBody.value
  }
  fetch(`http://localhost:8000/api/answers/`,{
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type':'application/json'
    },
    body: JSON.stringify(body)
  })
      .then(res => {
        console.log(res.json())
      })
      .then(data => {
        answerBody.value = ""
        fetchPost()
      })
      .catch(err => console.log(err.message))
}

const deleteAnswer = (answerId) => {
  fetch(`http://localhost:8000/api/answers/${answerId}/`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
      .then(res => {
        console.log(res)
        fetchPost()
      })
      .catch(error => console.log(error))
}

const upVoteAnswer = (answerId) => {
  fetch(`http://localhost:8000/api/answers/${answerId}/upvote/`,{
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(res => {
        console.log(res)
        isUpvoted.value = !isUpvoted.value
        // Si upvote est activé, désactiver le downvote
        if (isUpvoted.value) {
          isDownvoted.value = false
        }
      })
      .catch(error => console.log(error))
}

const downVoteAnswer = (answerId) => {
  console.log(answerId)
  fetch(`http://localhost:8000/api/answers/${answerId}/downvote/`,{
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
      .then(res => {
        console.log(res)
        isDownvoted.value = !isDownvoted.value

        if (isDownvoted.value) {
          isUpvoted.value = false
        }
      })
      .catch(error => console.log(error))
}

onMounted(() => {
  fetchPost()
})
</script>

<template>
  <BackButton />
  <div class="form-control my-5 py-3">
    <h2>{{ question.title }}</h2>
    <span class="text-muted">{{ question.author }}</span>
    <p>{{ question.body }}</p>
    <button
        v-on:click="upVote"
        :class="['btn', 'me-2', isUpvoted ? 'btn-success' : 'btn-outline-success']"
    >
      <i class="bi bi-arrow-up-circle"></i>
    </button>
    <button
        v-on:click="downVote"
        :class="['btn', 'me-2', isDownvoted ? 'btn-danger' : 'btn-outline-danger']"
    >
      <i class="bi bi-arrow-down-circle"></i>
    </button>
    <button v-on:click="deletePost" class="btn btn-outline-danger me-2"><i class="bi bi-trash"></i></button>
    <button class="btn btn-outline-warning me-2"><i class="bi bi-pen"></i></button>
    <div class="form-control my-5">
      <h3 class="my-3">Comments</h3>
      <form class="input-group" @submit.prevent="answerPost">
        <input v-model="answerBody" class="form-control" type="text" placeholder="write your comment ...">
        <button type="submit" class="btn btn-primary">send</button>
        <p>{{ answerBody }}</p>
      </form>
      <div class="form-control my-4">
        <span v-if="answers.length === 0">Pas de commentaire</span>
        <ul v-for="answer in question.answers" :key="answer.id">
          <li>
            <h4>{{ answer.author }}</h4>
            <p>{{ answer.body }}</p>
            <button v-on:click="upVoteAnswer(answer.id)" class="btn btn-outline-success me-2"><i class="bi bi-arrow-up-circle"></i></button>
            <button v-on:click="downVoteAnswer(answer.id)" class="btn btn-outline-danger me-2"><i class="bi bi-arrow-down-circle"></i></button>
            <button v-on:click="deleteAnswer(answer.id)" class="btn btn-outline-danger me-2"><i class="bi bi-trash"></i></button>
            <button class="btn btn-outline-warning me-2"><i class="bi bi-pen"></i></button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>