import apiFetch from "./api";

export const getAnalyticsDashboard = async ({
  view = "inventory",
  range = "today",
  start,
  end,
} = {}) => {
  const params = new URLSearchParams({ view, range });

  if (range === "custom") {
    if (start) {
      params.append("start_date", start);
    }
    if (end) {
      params.append("end_date", end);
    }
  }

  const response = await apiFetch(`/analytics/dashboard?${params.toString()}`);

  if (response?.success) {
    return response.data;
  }

  throw new Error(
    response?.message || "Failed to fetch analytics dashboard data"
  );
};

export default {
  getAnalyticsDashboard,
};

