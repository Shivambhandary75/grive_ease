import { useState, useEffect } from "react";
import filesIcon from "../../assets/files.png";
import schoolIcon from "../../assets/school.png";
import checkIcon from "../../assets/check.png";
import trendIcon from "../../assets/trend.png";
import { complaintsAPI, getUserData } from "../../utils/api";
import { useUser } from "../../context/UserContext";

export default function CheckComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      // If institutional user, get all complaints for their institution
      // Otherwise get user's own complaint history
      const response = user?.role === 'institutional' 
        ? await complaintsAPI.getInstitutionalComplaints()
        : await complaintsAPI.getHistory();
      setComplaints(response.complaints || []);
    } catch (err) {
      setError(err.message || "Failed to fetch complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus, comments = "") => {
    try {
      setError("");
      await complaintsAPI.updateStatus(complaintId, newStatus, comments);
      // Refresh complaints immediately
      await fetchComplaints();
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const handleQuickStatusChange = async (e, complaintId, newStatus) => {
    e.stopPropagation(); // Prevent modal from opening
    await handleStatusUpdate(complaintId, newStatus);
  };

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filteredComplaints = complaints.filter((complaint) => {
    const matchesStatus = filterStatus === "all" || complaint.status === filterStatus;
    const matchesSearch =
      complaint.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.institution?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleComplaintClick = (complaint) => {
    setSelectedComplaint(complaint);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedComplaint(null);
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      setError("");
      await handleStatusUpdate(complaintId, newStatus);
      // Close modal and refresh
      closeModal();
    } catch (err) {
      setError(err.message || "Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "under-review":
        return "bg-purple-100 text-purple-800";
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {user?.role === 'institutional' ? 'All Complaints - Manage & Update Status' : 'My Complaints'}
        </h1>
        <p className="text-gray-600">
          {user?.role === 'institutional' 
            ? 'View and manage all complaints filed in your institution. Update status from pending → in-progress → resolved.'
            : 'Track and manage all your filed complaints'}
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
      ) : (
        <>
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
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="under-review">Under Review</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List - Different view for institutional users */}
      {user?.role === 'institutional' ? (
        // Table view for institutional users
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-green-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Filed By</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Against</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredComplaints.length > 0 ? (
                  filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">
                        {complaint._id?.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleComplaintClick(complaint)}
                          className="text-green-600 hover:text-green-800 font-semibold text-left hover:underline"
                        >
                          {complaint.title}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {complaint.isAnonymous ? (
                          <span className="text-gray-500 italic">Anonymous</span>
                        ) : (
                          <span>
                            {complaint.complainant?.name || 'Unknown'}
                            <br />
                            <span className="text-xs text-gray-500">
                              {complaint.complainant?.role}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {complaint.accused?.name || 'Unknown'}
                        <br />
                        <span className="text-xs text-gray-500">
                          {complaint.accused?.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {complaint.category || 'General'}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getStatusColor(complaint.status)}`}>
                          {complaint.status?.replace('-', ' ').replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => handleQuickStatusChange(e, complaint._id, 'pending')}
                            disabled={complaint.status === 'pending'}
                            className="px-2 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Set to Pending"
                          >
                            Pending
                          </button>
                          <button
                            onClick={(e) => handleQuickStatusChange(e, complaint._id, 'in_progress')}
                            disabled={complaint.status === 'in_progress'}
                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Set to In Progress"
                          >
                            Progress
                          </button>
                          <button
                            onClick={(e) => handleQuickStatusChange(e, complaint._id, 'resolved')}
                            disabled={complaint.status === 'resolved'}
                            className="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Mark as Resolved"
                          >
                            Resolved
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-gray-500">
                      No complaints found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Original view for students/teachers
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
                      key={complaint._id}
                      onClick={() => handleComplaintClick(complaint)}
                      className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                        selectedComplaint?._id === complaint._id
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
                          <p className="text-xs text-gray-500">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-1 rounded ${getStatusColor(complaint.status)}`}>
                            {complaint.status?.replace('-', ' ').replace('_', ' ') || 'pending'}
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

          {/* Placeholder for list */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <p className="text-lg">Click on a complaint to view full details</p>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Detail Modal */}
      {showModal && selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="bg-green-600 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedComplaint.title}</h2>
                  <p className="text-green-100 mt-1">ID: {selectedComplaint._id?.slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={closeModal} className="text-white hover:text-gray-200 text-3xl font-bold leading-none">&times;</button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Status</p>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(selectedComplaint.status)} mt-1`}>
                    {selectedComplaint.status?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Priority</p>
                  <p className="text-lg font-bold text-gray-800 mt-1">
                    {selectedComplaint.priority?.toUpperCase() || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <p className="text-sm font-semibold text-gray-600">Description</p>
                <p className="text-gray-800 mt-1 leading-relaxed">{selectedComplaint.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600">Category</p>
                  <p className="text-gray-800 mt-1">{selectedComplaint.category || 'General'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Severity</p>
                  <p className="text-gray-800 mt-1">{selectedComplaint.severity || 'Medium'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Institution</p>
                  <p className="text-gray-800 mt-1">{selectedComplaint.institution?.name || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600">Filed On</p>
                  <p className="text-gray-800 mt-1">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Complainant Info */}
              {selectedComplaint.complainant && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Complainant Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedComplaint.isAnonymous ? 'Anonymous' : selectedComplaint.complainant.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Role</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedComplaint.complainant.role ? selectedComplaint.complainant.role.charAt(0).toUpperCase() + selectedComplaint.complainant.role.slice(1) : 'N/A'}
                      </p>
                    </div>
                    {!selectedComplaint.isAnonymous && selectedComplaint.complainant.email && (
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="text-gray-800 font-semibold">{selectedComplaint.complainant.email}</p>
                      </div>
                    )}
                    {!selectedComplaint.isAnonymous && selectedComplaint.complainant.studentId && (
                      <div>
                        <p className="text-gray-600">Student ID</p>
                        <p className="text-gray-800 font-semibold">{selectedComplaint.complainant.studentId}</p>
                      </div>
                    )}
                    {!selectedComplaint.isAnonymous && selectedComplaint.complainant.employeeId && (
                      <div>
                        <p className="text-gray-600">Employee ID</p>
                        <p className="text-gray-800 font-semibold">{selectedComplaint.complainant.employeeId}</p>
                      </div>
                    )}
                    {!selectedComplaint.isAnonymous && selectedComplaint.complainant.department && (
                      <div>
                        <p className="text-gray-600">Department</p>
                        <p className="text-gray-800 font-semibold">{selectedComplaint.complainant.department}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Accused Info */}
              {selectedComplaint.accused && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Accused Details</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="text-gray-800 font-semibold">{selectedComplaint.accused.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Type</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedComplaint.accused.type?.replace('_', ' ').charAt(0).toUpperCase() + selectedComplaint.accused.type?.slice(1).replace('_', ' ')}
                      </p>
                    </div>
                    {selectedComplaint.accused.user && (
                      <>
                        {selectedComplaint.accused.user.email && (
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="text-gray-800 font-semibold">{selectedComplaint.accused.user.email}</p>
                          </div>
                        )}
                        {selectedComplaint.accused.user.studentId && (
                          <div>
                            <p className="text-gray-600">Student ID</p>
                            <p className="text-gray-800 font-semibold">{selectedComplaint.accused.user.studentId}</p>
                          </div>
                        )}
                        {selectedComplaint.accused.user.employeeId && (
                          <div>
                            <p className="text-gray-600">Employee ID</p>
                            <p className="text-gray-800 font-semibold">{selectedComplaint.accused.user.employeeId}</p>
                          </div>
                        )}
                        {selectedComplaint.accused.user.department && (
                          <div>
                            <p className="text-gray-600">Department</p>
                            <p className="text-gray-800 font-semibold">{selectedComplaint.accused.user.department}</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Evidence Files */}
              {selectedComplaint.evidenceFiles && selectedComplaint.evidenceFiles.length > 0 && (
                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Evidence & Attachments</p>
                  <div className="space-y-2">
                    {selectedComplaint.evidenceFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-white p-3 rounded border border-purple-200">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-gray-800">{file.originalName || file.filename}</p>
                            <p className="text-xs text-gray-500">
                              Uploaded: {new Date(file.uploadedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {file.filePath && (
                          <a
                            href={file.filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-600 hover:text-purple-800 text-sm font-semibold"
                          >
                            View
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anonymous Badge */}
              {selectedComplaint.isAnonymous && (
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 rounded">
                  <p className="text-sm text-yellow-800 flex items-center gap-2">
                    This complaint was filed anonymously
                  </p>
                </div>
              )}

              {/* Tags */}
              {selectedComplaint.tags && selectedComplaint.tags.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedComplaint.tags.map((tag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-lg">
              {user?.role === 'institutional' ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-700">Update Complaint Status:</p>
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => handleStatusChange(selectedComplaint._id, 'pending')}
                      disabled={selectedComplaint.status === 'pending'}
                      className="bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedComplaint._id, 'in_progress')}
                      disabled={selectedComplaint.status === 'in_progress'}
                      className="bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => handleStatusChange(selectedComplaint._id, 'resolved')}
                      disabled={selectedComplaint.status === 'resolved'}
                      className="bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resolved
                    </button>
                  </div>
                  <button onClick={closeModal} className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                    Close
                  </button>
                </div>
              ) : (
                <button onClick={closeModal} className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition">
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}
