import { createStore } from "vuex";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import api from "@/services/api.js";

export default createStore({
    state: {
        token: localStorage.getItem('token') || null,
        user: (() => {
            const userData = localStorage.getItem('user');
            try {
                return userData ? JSON.parse(userData) : null;
            } catch (e) {
                localStorage.removeItem('user');
                return null;
            }
        })()
    },
    getters: {
        isLoggedIn: state => !!state.token,
        getUser: state => state.user
    },
    mutations: {
        setToken(state,token) {
            state.token = token
            localStorage.setItem('token', token)
        },
        setUser(state, user) {
            state.user = user
            localStorage.setItem('user', JSON.stringify(user))
        },
        clearAuth(state) {
            state.token = null
            state.user = null
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    },
    actions: {
        async login({ commit }, credentials){
            try {
                const response = axios.post('http://localhost:8000/login/', credentials)

                console.log((await response).data)

                const token = (await response).data.access
                const user = jwtDecode(token)

                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

                commit("setToken", token)
                commit("setUser", user)

                return true
            } catch (error) {
                console.log('connection error',error)
                return false
            }
        },
        logout({ commit }){
            delete axios.defaults.headers.common['Authorization']

            commit('clearAuth')
        }
    }
})