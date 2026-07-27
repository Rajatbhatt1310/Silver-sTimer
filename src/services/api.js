import axios from "axios";


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:8000/api/v1";


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
// READ COOKIE
// ============================================================

function getCookie(name) {
  const cookies =
    document.cookie
      ? document.cookie.split(";")
      : [];

  for (const cookie of cookies) {
    const trimmed = cookie.trim();

    if (
      trimmed.startsWith(
        `${name}=`
      )
    ) {
      return decodeURIComponent(
        trimmed.substring(
          name.length + 1
        )
      );
    }
  }

  return null;
}


// ============================================================
// ATTACH DJANGO CSRF TOKEN
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
      unsafeMethods.includes(method)
    ) {
      const csrfToken =
        getCookie("csrftoken");

      if (csrfToken) {
        config.headers[
          "X-CSRFToken"
        ] = csrfToken;
      }
    }

    return config;
  },

  (error) =>
    Promise.reject(error)
);


export default api;