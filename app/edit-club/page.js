"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";

const EditClubPage = () => {
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [userRole, setUserRole] = useState(null);

  const router = useRouter();

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const fetchClubData = async () => {
      const token = getToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        // Get user info
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const user = await userRes.json();
        setUserRole(user.role);

        if (user.role !== "chairman" && user.role !== "captain") {
          router.push("/unauthorized");
          return;
        }

        // Get club info
        const clubRes = await fetch(`${API_BASE_URL}/api/clubs/myclub`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!clubRes.ok) throw new Error("Failed to fetch club");

        const club = await clubRes.json();
        setClubData(club);
        setName(club.name);
        setDescription(club.description || "");
        setLogoUrl(club.logo_url || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token || !clubData?.id) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/clubs/${clubData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          logo_url: logoUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to update club");

      alert("Club updated successfully");
      router.push("/clubdashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Club</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Club Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
            rows={4}
          ></textarea>
        </div>

        <div>
          <label className="block mb-1 font-medium">Logo URL</label>
          <input
            type="text"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            className="px-4 py-2 bg-dark-green text-white rounded hover:bg-green-700"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.push("/clubdashboard")}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditClubPage;
