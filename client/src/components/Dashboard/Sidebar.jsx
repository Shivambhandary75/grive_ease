import { useState } from "react";
import dashboardIcon from "../../assets/dashboard.png";
import complaintIcon from "../../assets/complain.png";
import checkIcon from "../../assets/check.png";
import schoolIcon from "../../assets/school.png";
import chatbotIcon from "../../assets/chat-bot.png";
import userIcon from "../../assets/user.png";
import logoutIcon from "../../assets/logout.png";
import historyIcon from "../../assets/history.png";
import ConfirmDialog from "../ConfirmDialog";

export default function Sidebar({ activeTab, setActiveTab, onLogout, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: dashboardIcon },
    { id: "lodge-complaint", label: "Lodge Complaint", icon: complaintIcon },
    { id: "check-complaints", label: "My Complaints", icon: checkIcon },
    { id: "complaint-history", label: "History", icon: historyIcon },
    { id: "complaints-on-me", label: "On Me", icon: complaintIcon },
    { id: "browse-institutions", label: "Browse Institutions", icon: schoolIcon },
    { id: "ask-ai", label: "Ask AI", icon: chatbotIcon },
    { id: "profile", label: "Profile", icon: userIcon },
  ];

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-28"
      } bg-gradient-to-b from-green-700 to-green-900 text-white transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-6 border-b border-green-600 flex items-center justify-between">
        {sidebarOpen && (
          <div>
            <h1 className="text-2xl font-bold">GrieveEase</h1>
            <p className="text-xs text-green-200">Complaint Portal</p>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white hover:bg-green-600 p-2 rounded transition"
          title={sidebarOpen ? "Close menu" : "Open menu"}
        >
          {/* Hamburger Menu Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {sidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* User Info */}
      {sidebarOpen && (
        <div className="p-4 bg-green-600/50 border-b border-green-600">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-green-100">{user.email}</p>
          <span className="inline-block mt-2 px-2 py-1 bg-green-500 rounded text-xs font-semibold">
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        </div>
      )}

      {/* Menu Items */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded transition ${
              activeTab === item.id
                ? "bg-white text-green-700 font-semibold"
                : "hover:bg-green-600"
            }`}
            title={!sidebarOpen ? item.label : ""}
          >
            <img src={item.icon} alt={item.label} className="w-6 h-6" />
            {sidebarOpen && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-8 px-4 border-t border-green-600">
        <button
          onClick={() => setShowLogoutDialog(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded bg-red-600 hover:bg-red-700 transition font-semibold"
          title={!sidebarOpen ? "Logout" : ""}
        >
          <img src={logoutIcon} alt="Logout" className="w-6 h-6" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={() => {
          setShowLogoutDialog(false);
          onLogout();
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
