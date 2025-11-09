import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import CheckComplaints from "../components/Dashboard/CheckComplaints";
import LodgeComplaint from "../components/Dashboard/LodgeComplaint";
import BrowseInstitutions from "../components/Dashboard/BrowseInstitutions";
import UserProfile from "../components/Dashboard/UserProfile";
import Statistics from "../components/Dashboard/Statistics";
import AskAI from "../components/Dashboard/AskAI";
import ComplaintHistory from "../components/Dashboard/ComplaintHistory";
import ComplaintsOnMe from "../components/Dashboard/ComplaintsOnMe";
import { useUser } from "../context/UserContext";


export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, logout } = useUser();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/");
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Statistics setActiveTab={setActiveTab} />;
      case "check-complaints":
        return <CheckComplaints />;
      case "lodge-complaint":
        return <LodgeComplaint />;
      case "browse-institutions":
        return <BrowseInstitutions />;
      case "complaint-history":
        return <ComplaintHistory />;
      case "complaints-on-me":
        return <ComplaintsOnMe />;
      case "profile":
        return <UserProfile />;
      case "ask-ai":
        return <AskAI />;
      default:
        return <Statistics setActiveTab={setActiveTab} />;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} user={user} />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
