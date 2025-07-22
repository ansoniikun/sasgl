// utils/logout.js

export const logout = () => {
  // Clear local storage items
  localStorage.removeItem("token");
  localStorage.removeItem("loginTime");

  // Clear session storage caches
  sessionStorage.removeItem("clubDashboardData");
  sessionStorage.removeItem("dashboardData");
  sessionStorage.removeItem("userData");

  window.location.href = "/";
};
