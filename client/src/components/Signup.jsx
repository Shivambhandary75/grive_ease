import { useState } from "react";

export default function Signup({ switchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Signing up with\nEmail: ${email}\nPassword: ${password}`);
  };

  return (
    <div>
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-white"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-white">
        Already have an account?{" "}
        <button
          onClick={switchToLogin}
          className="text-green-950 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}
