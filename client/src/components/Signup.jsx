import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Signup({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupType, setSignupType] = useState("student");
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    // TODO: Send signup request to backend with signupType
    console.log(`Signing up with\nUsername: ${username}\nEmail: ${email}\nPassword: ${password}\nType: ${signupType}`);
    
    // Save user data to context
    setUserData({
      name: username,
      email: email,
      role: signupType,
    });
    
    navigate("/dashboard");
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      
      {/* Signup Type Selector */}
      <div className="mb-6 p-4 bg-green-50 rounded-lg border-2 border-green-200">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Sign Up As:</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="signupType"
              value="student"
              checked={signupType === "student"}
              onChange={(e) => setSignupType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Student</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="signupType"
              value="teacher"
              checked={signupType === "teacher"}
              onChange={(e) => setSignupType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Teacher</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="signupType"
              value="institutional"
              checked={signupType === "institutional"}
              onChange={(e) => setSignupType(e.target.value)}
              className="w-4 h-4 cursor-pointer accent-green-600"
            />
            <span className="text-gray-700 font-medium">Institutional</span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
        />
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-gray-700">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-green-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
