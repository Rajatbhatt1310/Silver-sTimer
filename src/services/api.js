import axios from "axios";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";


// ============================================================
// CSRF TOKEN STORAGE
// ============================================================

let csrfToken = null;

export function setCsrfToken(token) {
  csrfToken = token;
}


// ============================================================
// AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL: API_BASE_URL,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


// ============================================================
// ATTACH CSRF TOKEN
// ============================================================

api.interceptors.request.use(
  (config) => {
    const method =
      config.method?.toLowerCase();

    const unsafeMethods = [
      "post",
      "put",
      "patch",
      "delete",
    ];

    if (
      unsafeMethods.includes(method) &&
      csrfToken
    ) {
      config.headers["X-CSRFToken"] =
        csrfToken;
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


export default api;