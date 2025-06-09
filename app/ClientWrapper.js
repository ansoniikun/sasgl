"use client";

import { useEffect } from "react";
import { scheduleSessionTimeout } from "./utils/checkSession";

export default function ClientWrapper({ children }) {
  useEffect(() => {
    scheduleSessionTimeout(); // Only schedules it once
  }, []);

  return <>{children}</>;
}
