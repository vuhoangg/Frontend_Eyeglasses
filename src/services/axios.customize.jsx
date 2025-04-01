import axios from "axios";
// Set config defaults when creating the instance
console.log("check VITE_URL_Backend ", import.meta.env.VITE_BACKEND_URL)
const instance = axios.create({
    // baseURL: import.meta.env.VITE_BACKEND_URL
    baseURL: "http://localhost:8082"
});

// Add a request interceptor
instance.interceptors.request.use(function (config) {
    // Lấy token từ localStorage
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, function (error) {
    return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
    // check inside response 
    if(response.data && response.data.data) {
        return response.data;
    }
    return response;
}, function (error) {
    if(error.response && error.response.data) {
        return error.response.data;
    }
    return Promise.reject(error);
});

export default instance;