import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { authAPI, setToken, setUserData as saveUserData } from "../utils/api";

export default function Login({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      
      // Save token and user data
      setToken(response.token);
      saveUserData(response.user);
      
      // Update context
      setUserData({
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        institution: response.user.institution,
      });
      
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 rounded">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
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
