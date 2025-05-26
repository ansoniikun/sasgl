// utils/logout.js
export const logout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login"; // or use router.push('/login') if using useRouter
};
