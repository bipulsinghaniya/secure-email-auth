import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch(
          "https://secure-email-auth-backend.onrender.com/auth/dashboard",
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          navigate("/");
          return;
        }

        const data = await res.json();
        setName(data.name);
      } catch {
        navigate("/");
      }
    };

    loadDashboard();
  }, [navigate]);

  const logout = async () => {
    await fetch(
      "https://secure-email-auth-backend.onrender.com/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );
    navigate("/");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h2 className="text-xl font-bold mb-3">Dashboard</h2>
        <p className="mb-4">Hello {name}</p>

        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
