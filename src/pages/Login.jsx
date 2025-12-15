import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/userSlice";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await axios.post(
        "https://sabriaz-backend.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      dispatch(
        setCredentials({
          user: res.data.user,
          token: res.data.token,
        })
      );

      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-r from-gray-900 via-black to-gray-900 p-4"
    >
      {/* Glass Card */}
      <form
        className="backdrop-blur-xl bg-white/10 border border-white/20 
        shadow-2xl rounded-2xl p-8 w-full max-w-sm animate-fadeIn"
        onSubmit={handleLogin}
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-white">
          Welcome Back ✦
        </h2>
        <p className="text-center text-gray-300 mb-8 text-sm">
          Login to continue to your dashboard
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="text-gray-200 text-sm font-semibold">Email</label>
          <input
            type="email"
            className="w-full mt-1 p-3 rounded-md bg-white/20 text-white 
            border border-white/30 placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
            placeholder="Enter your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-gray-200 text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            className="w-full mt-1 p-3 rounded-md bg-white/20 text-white
            border border-white/30 placeholder-gray-300
            focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
            placeholder="Enter your password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-md bg-white text-black font-semibold 
          hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* Extra Links */}
        <div className="text-center mt-5">
          <p className="text-gray-300 text-sm">
            Dont have an acoount?
            <Link
              to={"/register"}
              className="text-white underline cursor-pointer"
            >
              Register now
            </Link>
          </p>
        </div>
      </form>

      {/* Fade-in Animation */}
      <style>
        {`
          .animate-fadeIn {
            animation: fadeIn 0.8s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Login;
