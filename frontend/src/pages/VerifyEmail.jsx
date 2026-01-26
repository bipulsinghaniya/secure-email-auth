import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API_BASE } from "../config";

export default function VerifyEmail() {
  const [msg, setMsg] = useState("Verifying...");
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    fetch(`${API_BASE}/auth/verify?token=${token}`)
      .then((res) => res.text())
      .then(setMsg)
      .catch(() => setMsg("Verification failed"));
  }, [params]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">Email Verification</h2>
        <p>{msg}</p>
      </div>
    </div>
  );
}
