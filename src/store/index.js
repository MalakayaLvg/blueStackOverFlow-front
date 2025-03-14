import { createStore } from "vuex";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

export default createStore({
    state: {
        token: localStorage.getItem('token') || null,
        user: JSON.parse(localStorage.getItem('user')) || null
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