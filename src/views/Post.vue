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

const isEditing = ref(false)
const editTitle = ref("")
const editBody = ref("")
const isEditingAnswer = ref(null)
const editAnswerBody = ref("")

const fetchPost = () => {
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/questions/${id.value}/`,{
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
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/questions/${id.value}/`, {
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

const startEditing = () => {
  editTitle.value = question.value.title
  editBody.value = question.value.body
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
}

const saveEdit = () => {
  const updatedQuestion = {
    title: editTitle.value,
    body: editBody.value
  }

  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/questions/${id.value}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedQuestion)
  })
      .then(res => res.json())
      .then(data => {
        question.value = data
        isEditing.value = false
      })
      .catch(error => console.log(error))
}

const upVote = () => {
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/questions/${id.value}/upvote/`,{
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
        fetchPost()
      })
      .catch(error => console.log(error))
}

const downVote = () => {
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/questions/${id.value}/downvote/`,{
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
        fetchPost()
      })
      .catch(error => console.log(error))
}

const answerPost = () => {
  console.log(answerBody.value)
  const body = {
    question: id.value,
    body: answerBody.value
  }
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/answers/`,{
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
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/answers/${answerId}/`, {
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
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/answers/${answerId}/upvote/`,{
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
        fetchPost()
      })
      .catch(error => console.log(error))
}

const downVoteAnswer = (answerId) => {
  console.log(answerId)
  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/answers/${answerId}/downvote/`,{
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
        fetchPost()
      })
      .catch(error => console.log(error))
}

const startEditingAnswer = (answer) => {
  isEditingAnswer.value = answer.id
  editAnswerBody.value = answer.body
}


const cancelEditingAnswer = () => {
  isEditingAnswer.value = null
  editAnswerBody.value = ""
}


const saveEditAnswer = (answerId) => {
  const updatedAnswer = {
    question: id.value,
    body: editAnswerBody.value
  }

  fetch(`https://back-bluestackover.malakayalauvergnat.com/api/answers/${answerId}/`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedAnswer)
  })
      .then(res => res.json())
      .then(data => {
        isEditingAnswer.value = null
        fetchPost()
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

    <div v-if="!isEditing">
      <h2>{{ question.title }}</h2>
      <span class="text-muted">{{ question.author }}</span>
      <p>{{ question.body }}</p>
      <div class="d-flex align-items-center mb-3">
        <button
            v-on:click="upVote"
            :class="['btn', 'me-1', isUpvoted ? 'btn-success' : 'btn-outline-success']"
        >
          <i class="bi bi-arrow-up-circle"></i>
        </button>
        <span class="me-3">{{ question.upvotes || 0 }}</span>

        <button
            v-on:click="downVote"
            :class="['btn', 'me-1', isDownvoted ? 'btn-danger' : 'btn-outline-danger']"
        >
          <i class="bi bi-arrow-down-circle"></i>
        </button>
        <span class="me-3">{{ question.downvotes || 0 }}</span>

        <button v-on:click="deletePost" class="btn btn-outline-danger me-2">
          <i class="bi bi-trash"></i>
        </button>
        <button v-on:click="startEditing" class="btn btn-outline-warning me-2">
          <i class="bi bi-pen"></i>
        </button>
      </div>
    </div>

    <div v-else class="mb-4">
      <div class="mb-3">
        <label for="edit-title" class="form-label">Titre</label>
        <input
            type="text"
            class="form-control"
            id="edit-title"
            v-model="editTitle"
        >
      </div>
      <div class="mb-3">
        <label for="edit-body" class="form-label">Contenu</label>
        <textarea
            class="form-control"
            id="edit-body"
            rows="5"
            v-model="editBody"
        ></textarea>
      </div>
      <div class="d-flex">
        <button @click="saveEdit" class="btn btn-primary me-2">Enregistrer</button>
        <button @click="cancelEditing" class="btn btn-secondary">Annuler</button>
      </div>
    </div>

    <div class="form-control my-5">
      <h3 class="my-3">Comments</h3>
      <form class="input-group" @submit.prevent="answerPost">
        <input v-model="answerBody" class="form-control" type="text" placeholder="write your comment ...">
        <button type="submit" class="btn btn-primary">send</button>
      </form>
      <div class="form-control my-4">
        <span v-if="answers.length === 0">Pas de commentaire</span>
        <ul class="list-unstyled" v-for="answer in question.answers" :key="answer.id">
          <li class="mb-4 p-3 border-bottom">
            <h4>{{ answer.author }}</h4>

            <!-- Affichage normal du commentaire -->
            <div v-if="isEditingAnswer !== answer.id">
              <p>{{ answer.body }}</p>
              <div class="d-flex align-items-center">
                <button v-on:click="upVoteAnswer(answer.id)"
                        class="btn btn-outline-success me-1">
                  <i class="bi bi-arrow-up-circle"></i>
                </button>
                <span class="me-3">{{ answer.upvotes || 0 }}</span>

                <button v-on:click="downVoteAnswer(answer.id)"
                        class="btn btn-outline-danger me-1">
                  <i class="bi bi-arrow-down-circle"></i>
                </button>
                <span class="me-3">{{ answer.downvotes || 0 }}</span>

                <button v-on:click="deleteAnswer(answer.id)"
                        class="btn btn-outline-danger me-2">
                  <i class="bi bi-trash"></i>
                </button>
                <button v-on:click="startEditingAnswer(answer)"
                        class="btn btn-outline-warning me-2">
                  <i class="bi bi-pen"></i>
                </button>
              </div>
            </div>

            <!-- Interface d'édition du commentaire -->
            <div v-else class="mb-3">
              <div class="mb-3">
                <label for="edit-answer-body" class="form-label">Contenu</label>
                <textarea
                    class="form-control"
                    id="edit-answer-body"
                    rows="3"
                    v-model="editAnswerBody"
                ></textarea>
              </div>
              <div class="d-flex">
                <button @click="saveEditAnswer(answer.id)" class="btn btn-primary me-2">Enregistrer</button>
                <button @click="cancelEditingAnswer" class="btn btn-secondary">Annuler</button>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
