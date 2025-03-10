import axios from "axios";
import store from "@/store/index.js";
import router from "@/router/index.js";

const api = axios.create({
    baseURL: "http://localhost:8000"
})

api.interceptors.request.use(config => {
    const token = store.state.token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            store.dispatch('logout')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default api;