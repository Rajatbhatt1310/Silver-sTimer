import api, { setCsrfToken } from "./api";


// ============================================================
// CSRF
// ============================================================

export async function getCsrfToken() {
  const response = await api.get(
    "/auth/csrf/"
  );

  const token =
    response.data.csrfToken;

  // Store token globally in our Axios API layer
  // so other services (focus, planner, settings, etc.)
  // can use it automatically.
  setCsrfToken(token);

  return token;
}


// ============================================================
// SIGNUP
// ============================================================

export async function signup(data) {
  const csrfToken =
    await getCsrfToken();

  const response = await api.post(
    "/auth/signup/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}


// ============================================================
// LOGIN
// ============================================================

export async function login(data) {
  const csrfToken =
    await getCsrfToken();

  const response = await api.post(
    "/auth/login/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}


// ============================================================
// LOGOUT
// ============================================================

export async function logout() {
  const csrfToken =
    await getCsrfToken();

  const response = await api.post(
    "/auth/logout/",
    {},
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}


// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser() {
  const response = await api.get(
    "/auth/me/"
  );

  return response.data;
}


// ============================================================
// DELETE ACCOUNT
// ============================================================

export async function deleteAccount() {
  const csrfToken =
    await getCsrfToken();

  const response = await api.delete(
    "/auth/delete-account/",
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}


// ============================================================
// CHANGE PASSWORD
// ============================================================

export async function changePassword(data) {
  const csrfToken =
    await getCsrfToken();

  const response = await api.post(
    "/auth/change-password/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}