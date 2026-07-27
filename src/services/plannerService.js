import api from "./api";
import { getCsrfToken } from "./authService";

export async function getTasks() {
  const response = await api.get("/planner/tasks/");
  return response.data;
}

export async function createTask(data) {
  const csrfToken = await getCsrfToken();

  const response = await api.post(
    "/planner/tasks/",
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

export async function updateTask(id, data) {
  const csrfToken = await getCsrfToken();

  const response = await api.patch(
    `/planner/tasks/${id}/`,
    data,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data.task;
}

export async function deleteTask(id) {
  const csrfToken = await getCsrfToken();

  const response = await api.delete(
    `/planner/tasks/${id}/`,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}

export async function getPlannerDashboard() {
  const response = await api.get(
    "/planner/dashboard/"
  );

  return response.data;
}