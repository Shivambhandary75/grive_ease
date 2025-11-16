import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { authAPI, setToken, setUserData as saveUserData } from "../utils/api";

export default function Signup({ switchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [signupType, setSignupType] = useState("student");
  const [institutionName, setInstitutionName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUserData } = useUser();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    
    if (!institutionName.trim()) {
      setError("Institution name is required");
      return;
    }
    
    setLoading(true);
    
    try {
      const userData = {
        name: username,
        email,
        password,
        role: signupType,
        institutionName,
        department: department || undefined,
        studentId: signupType === "student" ? studentId : undefined,
        employeeId: signupType === "teacher" ? employeeId : undefined,
      };
      
      const response = await authAPI.register(userData);
      
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
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border-2 border-red-500 text-red-800 rounded">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}
      
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
          placeholder="Full Name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
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
          type="text"
          placeholder="Institution Name *"
          value={institutionName}
          onChange={(e) => setInstitutionName(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
        
        {/* Conditional Fields */}
        {signupType === "student" && (
          <input
            type="text"
            placeholder="Student ID (optional)"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            disabled={loading}
          />
        )}
        
        {signupType === "teacher" && (
          <input
            type="text"
            placeholder="Employee ID (optional)"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            disabled={loading}
          />
        )}
        
        {(signupType === "student" || signupType === "teacher") && (
          <input
            type="text"
            placeholder="Department (optional)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
            disabled={loading}
          />
        )}
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 transition"
          required
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
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
