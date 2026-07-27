import api from "./api";

export async function getTasks(date) {
  const response = await api.get(
    "/planner/tasks/",
    {
      params: date ? { date } : {},
    }
  );

  return response.data.tasks;
}

export async function createTask(taskData) {
  const response = await api.post(
    "/planner/tasks/",
    taskData
  );

  return response.data.task;
}

export async function updateTask(taskId, taskData) {
  const response = await api.patch(
    `/planner/tasks/${taskId}/`,
    taskData
  );

  return response.data.task;
}

export async function deleteTask(taskId) {
  const response = await api.delete(
    `/planner/tasks/${taskId}/`
  );

  return response.data;
}

export async function toggleTask(task) {
  return updateTask(task.id, {
    completed: !task.completed,
  });
}