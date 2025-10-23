import { useNavigate } from "react-router-dom";
import landingPic from "../assets/landing_page_pic.jpg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      className="h-screen flex items-center justify-center relative bg-cover bg-center"
      style={{ backgroundImage: `url(${landingPic})` }}
    >
      {/* Black overlay for contrast */}
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Green overlay */}
      <div className="absolute inset-0 bg-green-500/30"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">
          Welcome to Our Website
        </h1>
        <button
          onClick={() => navigate("/auth")}
          className="px-6 py-3 bg-white text-green-950 font-semibold rounded-lg hover:bg-purple-100 transition shadow-lg"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
