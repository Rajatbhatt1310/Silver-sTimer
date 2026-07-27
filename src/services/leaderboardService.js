import api from "./api";


export async function getLeaderboard(
  period = "weekly"
) {
  const response = await api.get(
    "/leaderboards/",
    {
      params: {
        period,
      },
    }
  );

  return response.data;
}