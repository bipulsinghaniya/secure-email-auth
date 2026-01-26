import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

export default function Dashboard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/auth/dashboard`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => setName(data.name))
      .catch(() => navigate("/"));
  }, [navigate]);

  const logout = async () => {
    await fetch(`${API_BASE}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h2 className="text-xl font-bold mb-3">Dashboard</h2>
        <p>Hello {name}</p>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 mt-4 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
