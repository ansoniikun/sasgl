import { logout } from "./logout";

export const scheduleSessionTimeout = () => {
  const loginTime = localStorage.getItem("loginTime");

  if (!loginTime) return;

  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  const elapsed = now - Number(loginTime);
  const remaining = oneHour - elapsed;

  if (remaining <= 0) {
    logout();
  } else {
    setTimeout(() => {
      logout();
    }, remaining);
  }
};
