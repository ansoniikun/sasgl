"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminEvents from "../components/AdminEvents";
import { API_BASE_URL } from "../lib/config";

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState({
    users: [],
    userStats: [],
    clubs: [],
    clubStats: [],
    clubMembers: [],
    events: [],
    eventParticipants: [],
    logs: [],
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/dashboard");
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.replace("/dashboard");
          return;
        }

        const currentUser = await res.json();
        if (currentUser.role !== "admin") {
          router.replace("/dashboard");
          return;
        }

        setUser(currentUser);
      } catch (error) {
        router.replace("/dashboard");
      }
    };

    fetchUser();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/data`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const allData = await res.json();
          setData(allData);
        } else {
          // Optional: handle error or redirect
          router.replace("/dashboard");
        }
      } catch (error) {
        router.replace("/dashboard");
      }
    };

    if (user?.role === "admin") fetchData();
  }, [user, router]);

  if (user === null) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-dark-gold mb-10">
        Admin Panel
      </h1>
      <AdminEvents data={data.events} />
      {/* You can also pass the rest of the data to other components like Users, Clubs here */}
    </div>
  );
};

export default AdminPanel;
