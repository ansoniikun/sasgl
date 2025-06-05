// utils/logout.js

export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};
