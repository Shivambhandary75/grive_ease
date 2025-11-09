import { useState } from "react";
import filesIcon from "../../assets/files.png";
import schoolIcon from "../../assets/school.png";
import checkIcon from "../../assets/check.png";
import trendIcon from "../../assets/trend.png";

export default function CheckComplaints() {
  const [complaints, setComplaints] = useState([
    {
      id: 1,
      complaintId: "COM-ABC123",
      title: "Poor WiFi Connection",
      institution: "Central University",
      category: "facilities",
      date: "2025-11-08",
      status: "resolved",
      description: "WiFi is extremely slow in the library",
      responses: 2,
    },
    {
      id: 2,
      complaintId: "COM-XYZ789",
      title: "Canteen Food Quality",
      institution: "Central University",
      category: "food",
      date: "2025-11-07",
      status: "pending",
      description: "Food quality has deteriorated significantly",
      responses: 1,
    },
    {
      id: 3,
      complaintId: "COM-DEF456",
      title: "Lab Equipment Not Working",
      institution: "Central University",
      category: "academic",
      date: "2025-11-06",
      status: "under-review",
      description: "Microscopes in biology lab need maintenance",
      responses: 3,
    },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.institution.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  const getCategoryIcon = (category) => {
    const icons = {
      academic: filesIcon,
      facilities: schoolIcon,
      safety: checkIcon,
      food: trendIcon,
      staff: filesIcon,
      other: filesIcon,
    };
    return icons[category] || filesIcon;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Complaints</h1>
        <p className="text-gray-600">
          Track and manage all your filed complaints
        </p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full md:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under-review">Under Review</option>
              <option value="resolved">Resolved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Complaints List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white p-4">
              <h2 className="font-semibold">Complaints ({filteredComplaints.length})</h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredComplaints.length > 0 ? (
                filteredComplaints.map((complaint) => (
                  <div
                    key={complaint.id}
                    onClick={() => setSelectedComplaint(complaint)}
                    className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                      selectedComplaint?.id === complaint.id
                        ? "bg-green-50 border-l-4 border-green-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <img src={getCategoryIcon(complaint.category)} alt={complaint.category} className="w-6 h-6 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {complaint.title}
                        </p>
                        <p className="text-xs text-gray-500">{complaint.date}</p>
                        <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getStatusColor(complaint.status)}`}>
                          {complaint.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No complaints found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Complaint Details */}
        <div className="lg:col-span-2">
          {selectedComplaint ? (
            <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
              {/* Header */}
              <div className="border-b pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm text-gray-500">Complaint ID</p>
                    <p className="text-lg font-bold text-gray-800">{selectedComplaint.complaintId}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full font-semibold text-sm ${getStatusColor(selectedComplaint.status)}`}>
                    {selectedComplaint.status.replace("-", " ").toUpperCase()}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedComplaint.title}
                </h2>
                <p className="text-gray-600">{selectedComplaint.institution}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Category</p>
                  <p className="text-gray-800">
                    {getCategoryIcon(selectedComplaint.category)} {selectedComplaint.category}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-semibold">Filed Date</p>
                  <p className="text-gray-800">{selectedComplaint.date}</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">
                  {selectedComplaint.description}
                </p>
              </div>

              {/* Responses */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Responses ({selectedComplaint.responses})
                </h3>
                <div className="space-y-3 max-h-40 overflow-y-auto">
                  <div className="bg-white p-3 rounded border-l-4 border-green-600">
                    <p className="text-sm font-semibold text-gray-800">Admin Response</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Thank you for filing this complaint. We have forwarded it to the relevant department.
                    </p>
                    <p className="text-xs text-gray-400 mt-2">2 days ago</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Edit Complaint
                </button>
                <button className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                  Withdraw Complaint
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <p className="text-lg">Select a complaint to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
