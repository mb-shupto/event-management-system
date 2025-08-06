"use client";

import Image from "next/image";
import LOGO from "@/app/Logo/logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";

const showToast = (message: string, type: "success" | "error") => {
  const toastElement = document.createElement("div");
  toastElement.className = `fixed bottom-4 right-4 p-3 rounded-md text-white ${type === "success" ? "bg-green-500" : "bg-red-500"}`;
  toastElement.textContent = message;
  document.body.appendChild(toastElement);
  setTimeout(() => document.body.removeChild(toastElement), 3000);
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:8000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Server returned invalid JSON: " + text.substring(0, 50));
      }
      if (response.ok) {
        showToast("Login successful!", "success");
        router.push("/user/dashboard");
      } else {
        setError(data.message || "Login failed.");
        showToast("Login failed.", "error");
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError(String(err) || "An error occurred. Please try again.");
      showToast(String(err) || "Login error.", "error");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-r from-green-50 to-white min-h-screen flex items-center justify-center">
      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Image Placeholder - Replace with your image file */}
        <div className="w-full md:w-1/2 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500"><Image src="/signin-image.jpg" alt="Login Visual" width={500} height={500} /></p>
        </div>
        {/* Login Form */}
        <div className="w-full md:w-1/2 p-6 bg-white rounded-lg shadow-md">
          <div className="mb-6 flex items-center justify-center">
            <Image
              src={LOGO}
              alt="Event Management System Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-medium">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-medium">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-gray-600 text-sm">
            Don’t have an account? <a href="/user/register" className="text-blue-600 hover:underline">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
}