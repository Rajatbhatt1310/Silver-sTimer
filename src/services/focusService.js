import api from "./api";


export async function getFocusSessions() {
  const response = await api.get(
    "/focus/sessions/"
  );

  return response.data;
}


export async function startFocusSession(data) {
  const response = await api.post(
    "/focus/sessions/",
    data
  );

  return response.data;
}


export async function updateFocusSession(
  sessionId,
  data
) {
  const response = await api.patch(
    `/focus/sessions/${sessionId}/`,
    data
  );

  return response.data;
}


export async function createStopwatchLap(
  sessionId,
  duration
) {
  const response = await api.post(
    `/focus/sessions/${sessionId}/laps/`,
    {
      duration,
    }
  );

  return response.data;
}