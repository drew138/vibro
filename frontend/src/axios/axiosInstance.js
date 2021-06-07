import axios from "axios";
import localStorageService from "./localStorageService";
import { history } from "../history"
import { REFRESH_JWT_ENDPOINT } from "../config"
// https://medium.com/swlh/handling-access-and-refresh-tokens-using-axios-interceptors-3970b601a5da
// LocalstorageService


// Add a request interceptor
export const requestInterceptor = axios.interceptors.request.use(
    config => {
        const token = localStorageService.getAccessToken();
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        // config.headers['Content-Type'] = 'application/json';
        return config;
    },
    error => {
        Promise.reject(error)
    });

//Add a response interceptor
export const responseInterceptor = axios.interceptors.response.use((response) => {
    return response
}, function (error) {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url ===
        REFRESH_JWT_ENDPOINT) {
        history.push('/pages/login');
        localStorageService.clearToken();
        localStorageService.clearUserValues();
        return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {

        originalRequest._retry = true;
        const refreshToken = localStorageService.getRefreshToken();
        const res = axios.post(REFRESH_JWT_ENDPOINT,
            {
                "refresh": refreshToken
            })
        if (res.status === 201) {
            localStorageService.setToken(res.data);
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorageService.getAccessToken();
            return axios(originalRequest);
        }
        return
    }
    return Promise.reject(error);
});

