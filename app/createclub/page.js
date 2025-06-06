"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ClubRegister from "../components/ClubRegister";
import DashboardNav from "../components/DashboardNav";
import { API_BASE_URL } from "../lib/config";

export default function CreateClubPage() {
  const [authorized, setAuthorized] = useState(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          console.error("Error fetching user:", data);
          return;
        }

        const { role } = data;

        if (role === "captain" || role === "chairman") {
          setAuthorized(true);
        } else {
          setMessage(
            "You are not authorized to access this page, redirecting to your dashboard."
          );
          setAuthorized(false);
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000); // 3-second delay before redirect
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setMessage("Error verifying access. Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      }
    };

    checkRole();
  }, [router]);

  if (authorized === null) {
    return (
      <>
        <DashboardNav />
        <p className="mt-36 text-center">Checking permissions...</p>
      </>
    );
  }

  if (!authorized) {
    return (
      <>
        <DashboardNav />
        <p className="mt-36 text-center text-red-500">{message}</p>
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <ClubRegister />
    </>
  );
}
