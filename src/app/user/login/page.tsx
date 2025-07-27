"use client";

import { useState } from "react";
import Image from "next/image";
import LOGO from "@/app/logo/logo.png";
import SuccessModal from "@/components/SuccessModal";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsSuccess(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Image
        src={LOGO}
        alt="Event Management System Logo"
        width={150}
        height={150}
        className="mb-8"
        priority
      />
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            required
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-md focus:ring focus:ring-blue-300 text-black"
            required
            aria-required="true"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          aria-label="Log in to your account"
        >
          Log In
        </button>
        <div className="text-center">
          <p className="mt-4 text-black">
            Don&apos;t have an account?{" "}
            <a href="/user/register" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
          <p className="mt-2 text-black">Forgot your password? <a href="#" className="text-blue-500 hover:underline">Reset Here</a></p>
          <p className="mt-2 text-black"><a href="\" className="text-blue-500 hover:underline">Back</a></p>
        </div>
      </form>
      <SuccessModal isOpen={isSuccess} />
    </div>
  );
}