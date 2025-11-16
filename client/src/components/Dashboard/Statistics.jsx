import { useState, useEffect } from "react";
import complaintIcon from "../../assets/complain.png";
import trendIcon from "../../assets/trend.png";
import hourglassIcon from "../../assets/hour-glass.png";
import searchIcon from "../../assets/search-interface-symbol.png";
import checkIcon from "../../assets/check.png";
import chatbotIcon from "../../assets/chat-bot.png";
import { complaintsAPI, institutionsAPI } from "../../utils/api";
import { useUser } from "../../context/UserContext";

export default function Statistics({ setActiveTab }) {
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    underReview: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch complaints based on role
      let complaintsData;
      if (user?.role === 'institutional') {
        const dashboardStats = await institutionsAPI.getDashboardStats();
        setStats({
          total: dashboardStats.totalComplaints || 0,
          resolved: dashboardStats.resolvedComplaints || 0,
          pending: dashboardStats.pendingComplaints || 0,
          underReview: dashboardStats.underReviewComplaints || 0
        });
        
        complaintsData = await complaintsAPI.getInstitutionalComplaints({ limit: 3 });
      } else {
        complaintsData = await complaintsAPI.getHistory({ limit: 3 });
        
        // Calculate stats from complaints
        const allComplaints = complaintsData.complaints || [];
        setStats({
          total: allComplaints.length,
          resolved: allComplaints.filter(c => c.status === 'resolved').length,
          pending: allComplaints.filter(c => c.status === 'pending').length,
          underReview: allComplaints.filter(c => c.status === 'under-review').length
        });
      }
      
      setRecentComplaints(complaintsData.complaints || []);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const statsDisplay = [
    { label: "Total Complaints", value: stats.total, icon: complaintIcon, color: "blue" },
    { label: "Resolved", value: stats.resolved, icon: checkIcon, color: "green" },
    { label: "Pending", value: stats.pending, icon: hourglassIcon, color: "yellow" },
    { label: "Under Review", value: stats.underReview, icon: searchIcon, color: "purple" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome to GrieveEase!</h1>
        <p className="text-lg text-green-100">
          Your platform to lodge and track complaints efficiently
        </p>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {statsDisplay.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition border-l-4 border-green-600"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                <p className="text-4xl font-bold text-gray-800 mt-2">{stat.value}</p>
              </div>
              <img src={stat.icon} alt={stat.label} className="w-12 h-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setActiveTab("lodge-complaint")} className="p-4 bg-blue-50 border-2 border-blue-300 rounded-lg hover:bg-blue-100 transition text-left cursor-pointer">
            <img src={complaintIcon} alt="Lodge Complaint" className="w-8 h-8 mb-2" />
            <p className="font-semibold text-gray-800">Lodge New Complaint</p>
            <p className="text-sm text-gray-600">File a new complaint</p>
          </button>
          <button onClick={() => setActiveTab("ask-ai")} className="p-4 bg-purple-50 border-2 border-purple-300 rounded-lg hover:bg-purple-100 transition text-left cursor-pointer">
            <img src={chatbotIcon} alt="Ask AI" className="w-8 h-8 mb-2" />
            <p className="font-semibold text-gray-800">Ask AI</p>
            <p className="text-sm text-gray-600">Get AI assistance</p>
          </button>
          <button onClick={() => setActiveTab("browse-institutions")} className="p-4 bg-orange-50 border-2 border-orange-300 rounded-lg hover:bg-orange-100 transition text-left cursor-pointer">
            <img src={searchIcon} alt="Browse Institutions" className="w-8 h-8 mb-2" />
            <p className="font-semibold text-gray-800">Browse Institutions</p>
            <p className="text-sm text-gray-600">Check institution reviews</p>
          </button>
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Complaints</h2>
        {recentComplaints.length === 0 ? (
          <p className="text-gray-600 text-center py-4">No recent complaints</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Institution</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentComplaints.map((complaint) => (
                  <tr key={complaint._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-800">{complaint.title}</td>
                    <td className="py-3 px-4 text-gray-600">{complaint.institution?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-600">{new Date(complaint.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        complaint.status === "resolved" || complaint.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : complaint.status === "pending" || complaint.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {complaint.status?.charAt(0).toUpperCase() + complaint.status?.slice(1).replace('-', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </div>
        </>
      )}
    </div>
  );
}
