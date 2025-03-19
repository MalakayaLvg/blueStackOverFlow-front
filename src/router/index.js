import { createRouter, createWebHistory } from 'vue-router';
import store from "@/store/index.js";

import Login from '../views/Login.vue'
import Home from "@/views/Home.vue";
import Post from "@/views/Post.vue";
import Profile from "@/views/Profile.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/post/:id',
            name: 'Post',
            component: Post
        },
        {
            path: '/login',
            name: 'Login',
            component: Login,
            meta: {
                guestOnly: true
            }
        },
        {
            path: '/profile',
            name: 'Profile',
            component: Profile,
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isLoggedIn = store.getters.isLoggedIn

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isLoggedIn) {
            next('/login')
        } else {
            next()
        }
    }
    else if (to.matched.some(record => record.meta.guestOnly)) {
        if (isLoggedIn) {
            next('/')
        } else {
            next()
        }
    } else {
        next()
    }
})

export default router