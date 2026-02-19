import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.svg";
import { signupUser } from "../features/auth/authActions";
import { useSelector, useDispatch } from "react-redux";
import {Loader2 }from "lucide-react";


export default function SignUp() {
  const dispatch = useDispatch();
  const { error, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append("fullName", formData.fullName);
    submitData.append("username", formData.username.toLowerCase());
    submitData.append("email", formData.email.toLowerCase());
    submitData.append("password", formData.password);

    if (formData.avatar) {
      submitData.append("avatar", formData.avatar);
    }

    if (formData.coverImage) {
      submitData.append("coverImage", formData.coverImage);
    }

    dispatch(signupUser(submitData));
    
  };

  const handleSignInClick = () => {
    navigate("/sign-in");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 mb-3">
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-white text-2xl font-bold">PLAY</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-sm mb-2">
                Full Name*
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Username*</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Password*</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-white text-sm mb-2">Avatar*</label>
              <label className="block cursor-pointer">
                <div className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-gray-400 hover:border-purple-500 transition-colors flex items-center justify-center">
                  {formData.avatar
                    ? formData.avatar.name
                    : "Choose avatar image"}
                </div>
                <input
                  type="file"
                  name="avatar"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  required
                />
              </label>
            </div>

            <div>
              <label className="block text-white text-sm mb-2">
                Cover Image (Optional)
              </label>
              <label className="block cursor-pointer">
                <div className="w-full px-4 py-2.5 bg-transparent border border-gray-600 rounded text-gray-400 hover:border-purple-500 transition-colors flex items-center justify-center">
                  {formData.coverImage
                    ? formData.coverImage.name
                    : "Choose cover image"}
                </div>
                <input
                  type="file"
                  name="coverImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 rounded transition-colors duration-200 cursor-pointer"
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <Loader2 className="size-5 animate-spin" /> signing up...
              </div>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <button
              onClick={handleSignInClick}
              className="text-purple-500 hover:text-purple-400 font-semibold transition-colors cursor-pointer"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
