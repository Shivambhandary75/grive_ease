export default function ComplaintHistory() {
  const complaints = [
    {
      id: 1,
      complaintId: "COM-ABC123",
      title: "Poor WiFi Connection",
      institution: "Central University",
      category: "facilities",
      date: "2025-11-08",
      status: "resolved",
      priority: "medium",
    },
    {
      id: 2,
      complaintId: "COM-XYZ789",
      title: "Canteen Food Quality",
      institution: "Central University",
      category: "food",
      date: "2025-11-07",
      status: "pending",
      priority: "low",
    },
    {
      id: 3,
      complaintId: "COM-DEF456",
      title: "Lab Equipment Not Working",
      institution: "Central University",
      category: "academic",
      date: "2025-11-06",
      status: "under-review",
      priority: "high",
    },
    {
      id: 4,
      complaintId: "COM-GHI789",
      title: "Broken Chairs in Classroom",
      institution: "Lincoln High School",
      category: "facilities",
      date: "2025-11-05",
      status: "resolved",
      priority: "low",
    },
  ];

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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Complaint History</h1>
        <p className="text-gray-600">
          View all complaints you have filed
        </p>
      </div>

      {/* Complaints Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Complaint ID</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Institution</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4 text-gray-800 font-semibold">{complaint.complaintId}</td>
                  <td className="py-3 px-4 text-gray-800">{complaint.title}</td>
                  <td className="py-3 px-4 text-gray-600">{complaint.institution}</td>
                  <td className="py-3 px-4 text-gray-600">{complaint.date}</td>
                  <td className={`py-3 px-4 ${getPriorityColor(complaint.priority)}`}>
                    {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-600">
          <p className="text-gray-600 text-sm font-semibold">Total Complaints</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{complaints.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-600">
          <p className="text-gray-600 text-sm font-semibold">Resolved</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {complaints.filter(c => c.status === "resolved").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-600">
          <p className="text-gray-600 text-sm font-semibold">Pending</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {complaints.filter(c => c.status === "pending").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-600">
          <p className="text-gray-600 text-sm font-semibold">Under Review</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">
            {complaints.filter(c => c.status === "under-review").length}
          </p>
        </div>
      </div>
    </div>
  );
}
