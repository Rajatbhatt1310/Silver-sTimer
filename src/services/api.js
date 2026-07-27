import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


// ---------------------------------------------
// Read a cookie by name
// ---------------------------------------------

function getCookie(name) {
  const cookies =
    document.cookie
      ? document.cookie.split(";")
      : [];

  for (const cookie of cookies) {
    const trimmed =
      cookie.trim();

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


// ---------------------------------------------
// Attach Django CSRF token automatically
// ---------------------------------------------

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