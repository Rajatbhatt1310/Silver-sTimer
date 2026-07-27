import api from "./api";


export async function getNotifications() {
  const response = await api.get(
    "/notifications/"
  );

  return response.data;
}


export async function markNotificationRead(
  notificationId
) {
  const response = await api.patch(
    `/notifications/${notificationId}/`,
    {
      is_read: true,
    }
  );

  return response.data;
}


export async function markAllNotificationsRead() {
  const response = await api.post(
    "/notifications/read-all/"
  );

  return response.data;
}