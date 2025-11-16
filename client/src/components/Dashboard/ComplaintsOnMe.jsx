import { useState, useEffect } from "react";
import { complaintsAPI } from "../../utils/api";

export default function ComplaintsOnMe() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const response = await complaintsAPI.getComplaintsOnMe();
      setComplaints(response.complaints || []);
    } catch (err) {
      setError(err.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "under-review":
        return "bg-blue-100 text-blue-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600 font-semibold";
      case "medium":
        return "text-orange-600 font-semibold";
      case "low":
        return "text-green-600 font-semibold";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Complaints On Me</h1>
        <p className="text-gray-600">
          View complaints that have been filed against you
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No complaints found</p>
        </div>
      ) : (
        <>
          {/* Complaints Cards */}
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <div key={complaint._id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                        {complaint.status?.replace('-', ' ').charAt(0).toUpperCase() + complaint.status?.slice(1) || 'N/A'}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">Complaint ID: {complaint._id?.slice(-6).toUpperCase()}</p>
                  </div>
                  <div className={`text-lg ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority?.toUpperCase() || 'N/A'}
                  </div>
                </div>

                <p className="text-gray-700 mb-3">{complaint.description}</p>

                <div className="flex justify-between items-center text-sm text-gray-600">
                  <div>
                    <p className="font-semibold">Filed by: <span className="text-gray-800">{complaint.isAnonymous ? 'Anonymous' : complaint.complainant?.name || 'Unknown'}</span></p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors">
                    Respond
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
              <p className="text-gray-600 text-sm font-semibold">Total Complaints</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{complaints.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-600">
              <p className="text-gray-600 text-sm font-semibold">High Priority</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {complaints.filter(c => c.priority === "high" || c.priority === "urgent").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
              <p className="text-gray-600 text-sm font-semibold">Pending</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {complaints.filter(c => c.status === "pending").length}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
              <p className="text-gray-600 text-sm font-semibold">Resolved</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {complaints.filter(c => c.status === "resolved").length}
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
