import api from "./api";


export async function getAnalytics() {
  const response = await api.get(
    "/analytics/"
  );

  return response.data;
}


export async function getTrackerStatus() {
  const response = await api.get(
    "/analytics/tracker/"
  );

  return response.data;
}


export async function getTrackerAnalysis() {
  const response = await api.get(
    "/analytics/tracker/analysis/"
  );

  return response.data;
}


// ==================================================
// STOPWATCH TRACKER
// ==================================================

export async function getStopwatchStatus() {
  const response = await api.get(
    "/analytics/stopwatch/"
  );

  return response.data;
}


export async function getStopwatchAnalysis() {
  const response = await api.get(
    "/analytics/stopwatch/analysis/"
  );

  return response.data;
}
