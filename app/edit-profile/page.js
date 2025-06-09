"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../lib/config";
import { storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
  });
  const [profileFile, setProfileFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUserData({
          name: data.name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          password: "",
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e) => {
    setUserData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    const token = localStorage.getItem("token");

    try {
      let profile_picture = null;

      // If a new profile picture file is selected, upload it to Firebase Storage
      if (profileFile) {
        const fileName = `${Date.now()}_${profileFile.name}`;
        const storageRef = ref(storage, `profile_pictures/${fileName}`);
        await uploadBytes(storageRef, profileFile);

        // Save only the file name in the DB, not the download URL
        profile_picture = fileName;
      }

      // Prepare data to send to backend
      const bodyData = { ...userData };
      if (profile_picture) {
        bodyData.profile_picture = profile_picture;
      }

      const res = await fetch(`${API_BASE_URL}/api/dashboard/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("Profile updated successfully!");
    } catch (err) {
      setMessage(err.message || "Update failed");
    }
  };

  if (loading) return <p className="mt-36 text-center">Loading profile...</p>;

  return (
    <div className="max-w-2xl mx-auto py-24 px-4">
      <h1 className="text-3xl font-bold mb-6">Edit Profile</h1>

      {message && (
        <div className="mb-4 p-3 bg-gray-100 text-center rounded text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Profile Picture</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            value={userData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            value={userData.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            className="w-full p-2 border rounded"
            value={userData.phone_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">New Password</label>
          <input
            type="password"
            name="password"
            className="w-full p-2 border rounded"
            value={userData.password}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
          />
        </div>

        <div className="flex items-center gap-4 mt-4">
          <button
            type="submit"
            className="bg-dark-green text-white py-2 px-6 rounded shadow hover:bg-green-700 transition"
          >
            Save Changes
          </button>

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded shadow hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;
