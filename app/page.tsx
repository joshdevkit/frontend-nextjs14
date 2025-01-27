"use client";
import { getToken } from "@/redux/authSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Loader } from "lucide-react";

export default function Home() {
  const token = useSelector(getToken);
  const navigate = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (token) {
        navigate.push("/dashboard");
      } else {
        setLoading(false);
        navigate.push("/login");
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [token, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center p-6 rounded-lg shadow-lg bg-white">
          <Loader
            className="animate-spin text-blue-500 mx-auto mb-4"
            size={64}
          />
          <h2 className="text-xl font-semibold text-gray-700">
            Loading, Plase Wait for a moment...
          </h2>
        </div>
      </div>
    );
  }
}
