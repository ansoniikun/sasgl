// utils/logout.js

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loginTime");
  sessionStorage.removeItem("clubDashboardData");
  sessionStorage.removeItem("dashboardData");
  window.location.href = "/";
};
