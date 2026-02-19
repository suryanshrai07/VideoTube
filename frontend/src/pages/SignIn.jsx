import React, { use, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authActions";
import logo from "../assets/logo.svg";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleSignUpClick = () => {
    navigate("/sign-up");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain "
            />
          </div>
          <h1 className="text-white text-3xl font-bold">PLAY</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white text-sm mb-2">Email*</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm mb-2">Password*</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-3 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              required
            />
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded transition-colors duration-200 cursor-pointer"
          >
            {loading ? "Logging in..." : "Sign in With Email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">
            New to VideoTube?{" "}
            <button
              onClick={handleSignUpClick}
              className="text-purple-500 hover:text-purple-400 font-semibold transition-colors cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
