import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3"
const TMDB_TOKEN = import.meta.env.VITE_APP_TMDB_TOKEN;

axios.defaults.baseURL = BASE_URL;

axios.interceptors.request.use(config => {
    config.headers.Authorization = "Bearer " + TMDB_TOKEN;

    return config
}, error => {
    console.log(error)
})

axios.interceptors.response.use(res => {
    return res.data
})

