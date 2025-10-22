import { useState } from "react";
import Login from "../components/Login";
import Signup from "../components/Signup";
import authBg from "../assets/auth_page_pic.jpg"; // reuse your landing page image

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div
      className="relative flex justify-center items-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${authBg})` }}
    >
      {/* Green overlay */}
      <div className="absolute inset-0 bg-green-700/60"></div>

      {/* Transparent card container */}
<div className="relative z-10 w-full max-w-md p-8 bg-transparent rounded-2xl shadow-2xl border border-white">
        {showLogin ? (
          <Login switchToSignup={() => setShowLogin(false)} />
        ) : (
          <Signup switchToLogin={() => setShowLogin(true)} />
        )}
      </div>
    </div>
  );
}
