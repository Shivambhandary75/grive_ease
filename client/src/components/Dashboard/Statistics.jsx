import complaintIcon from "../../assets/complain.png";
import trendIcon from "../../assets/trend.png";
import hourglassIcon from "../../assets/hour-glass.png";
import searchIcon from "../../assets/search-interface-symbol.png";
import checkIcon from "../../assets/check.png";
import chatbotIcon from "../../assets/chat-bot.png";

export default function Statistics({ setActiveTab }) {
  const stats = [
    { label: "Total Complaints", value: 12, icon: complaintIcon, color: "blue" },
    { label: "Resolved", value: 8, icon: checkIcon, color: "green" },
    { label: "Pending", value: 3, icon: hourglassIcon, color: "yellow" },
    { label: "Under Review", value: 1, icon: searchIcon, color: "purple" },
  ];

  const recentComplaints = [
    {
      id: 1,
      title: "Poor WiFi Connection",
      institution: "Central University",
      date: "2025-11-08",
      status: "Resolved",
    },
    {
      id: 2,
      title: "Canteen Food Quality",
      institution: "Central University",
      date: "2025-11-07",
      status: "Pending",
    },
    {
      id: 3,
      title: "Lab Equipment Not Working",
      institution: "Central University",
      date: "2025-11-06",
      status: "Under Review",
    },
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

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
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
                <tr key={complaint.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800">{complaint.title}</td>
                  <td className="py-3 px-4 text-gray-600">{complaint.institution}</td>
                  <td className="py-3 px-4 text-gray-600">{complaint.date}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        complaint.status === "Resolved"
                          ? "bg-green-100 text-green-800"
                          : complaint.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {complaint.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
