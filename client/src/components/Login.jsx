import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState("student");
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Send login request to backend with loginType
    console.log(`Logging in with\nEmail: ${email}\nPassword: ${password}\nType: ${loginType}`);
    
    // Save user data to context
    setUserData({
      email: email,
      role: loginType,
      name: "User", // Will be updated from backend or signup
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {/* Login Type Selector */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Login As:</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="loginType"
              value="student"
              checked={loginType === "student"}
              onChange={(e) => setLoginType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Student</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="loginType"
              value="teacher"
              checked={loginType === "teacher"}
              onChange={(e) => setLoginType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Teacher</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="loginType"
              value="institutional"
              checked={loginType === "institutional"}
              onChange={(e) => setLoginType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Institutional</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-700">
        Don't have an account?{" "}
        <button
          onClick={switchToSignup}
          className="text-green-600 font-semibold hover:underline"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}
