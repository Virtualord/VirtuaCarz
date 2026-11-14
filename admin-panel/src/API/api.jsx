import axios from "axios"

const API = axios.create({
    // Production builds call the API on the same origin; Vite proxies /api in dev.
    baseURL: import.meta.env.VITE_BASEURL || "/api/v1",
});

API.interceptors.request.use(async (config) => {
    try {
        const localData = localStorage.getItem("appData");
        const appData = JSON.parse(localData);
        if (appData) {
            config.headers.Authorization = `${appData?.token}`;
        }
    } catch(error) {
        console.log(error);
    }
    return config;
}, (error) => {
    return Promise.reject(error)
});

export default API; 