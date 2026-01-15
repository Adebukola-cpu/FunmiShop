import api from ".../utils/axios";

const axios = axios.create({
    baseURL: "http://localhost:5007/api/v1",
});

// REQUEST: attach token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE: catch expired token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            alert("Session expired. Please login again.");

            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default axios;
