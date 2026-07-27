import api from "./api";
import { getCsrfToken } from "./authService";


export async function getNotificationPreferences() {
  const response = await api.get(
    "/users/notification-preferences/"
  );

  return response.data;
}


export async function updateNotificationPreferences(
  preferences
) {
  const csrfToken =
    await getCsrfToken();

  const response = await api.patch(
    "/users/notification-preferences/",
    preferences,
    {
      headers: {
        "X-CSRFToken": csrfToken,
      },
    }
  );

  return response.data;
}