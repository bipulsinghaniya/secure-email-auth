import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function VerifyEmail() {
  const [msg, setMsg] = useState("Verifying...");
  const [params] = useSearchParams();

  useEffect(() => {
    const token = params.get("token");

    fetch(
      `https://secure-email-auth-backend.onrender.com/auth/verify?token=${token}`
    )
      .then((res) => res.text())
      .then((data) => setMsg(data))
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
