// import React from 'react'
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signInFailure, signInStart, signInSuccess } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const {loading, error} = useSelector((state) => state.user)
  const navigate = useNavigate();

const dispatch = useDispatch();
const [showPassword, setShowPassword] = useState(false);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    dispatch(signInStart());

    const res = await fetch(
      "https://mern-estate-backend-iz4a.onrender.com/api/auth/signin",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      }
    );

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.log("Server returned non-JSON:", text);
      dispatch(signInFailure("Server error"));
      return;
    }

    if (!res.ok) {
      dispatch(signInFailure(data.message || "Signin failed"));
      return;
    }

    dispatch(signInSuccess(data));
    navigate("/");
  } catch (error) {
    dispatch(signInFailure(error.message));
  }
};
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="email"
          className="p-3 border rounded-lg"
          id="email"
          onChange={handleChange}
        />
        <div className="relative">
  <input
    type={showPassword ? "text" : "password"}
    placeholder="password"
    className="p-3 border rounded-lg w-full"
    id="password"
    onChange={handleChange}
  />
  <span
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
  >
    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
  </span>
</div>
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex gap-2 mt-5">
        <p>Don&apos;t have an accoun?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign Up</span>
        </Link>
      </div>
      {error && <p className="text-red-500 mt-5">{error}</p>}
    </div>
  );
}
