import axios from "axios";




// Create a plain axios instance (no auth)
export const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});



// Create a secure axios instance (with auth handling)
const axiosSecure = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});



// ---------- Request Interceptor ----------

axiosSecure.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);




// ---------- Response Interceptor ----------
axiosSecure.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            try {

                const token = localStorage.getItem("refreshToken");
                const refreshResponse = await axiosApi.post("/auth/token/refresh/", { refresh: token });
                const accessToken = refreshResponse.data.access;

                localStorage.setItem("accessToken", accessToken);

                // Retry original request with new token
                error.config.headers.Authorization = `Bearer ${accessToken}`;
                return axios(error.config);
            } catch (err: any) {
                console.error("Token refresh failed:", err.response?.data?.message);

                // Clear storage and redirect
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");

                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default axiosSecure;
