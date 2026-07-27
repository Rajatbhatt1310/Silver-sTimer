import api from "./api";


export async function getCsrfToken() {
  const response = await api.get(
    "/auth/csrf/"
  );

  return response.data.csrfToken;
}


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


export async function getCurrentUser() {
  const response = await api.get(
    "/auth/me/"
  );

  return response.data;
}

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