// utils/logout.js

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("loginTime");
  window.location.href = "/";
};
