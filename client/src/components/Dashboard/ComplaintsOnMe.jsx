export default function ComplaintsOnMe() {
  const complaints = [
    {
      id: 1,
      complaintId: "COM-ABC789",
      title: "Poor Class Management",
      filedBy: "Rahul Kumar",
      date: "2025-11-10",
      status: "pending",
      priority: "high",
      description: "Student is not managing class effectively",
    },
    {
      id: 2,
      complaintId: "COM-XYZ456",
      title: "Unfair Grading",
      filedBy: "Priya Sharma",
      date: "2025-11-09",
      status: "under-review",
      priority: "high",
      description: "Assignment graded unfairly without proper evaluation",
    },
    {
      id: 3,
      complaintId: "COM-DEF123",
      title: "Incomplete Lab Instructions",
      filedBy: "Arjun Singh",
      date: "2025-11-08",
      status: "resolved",
      priority: "medium",
      description: "Lab instructions were not clear and incomplete",
    },
    {
      id: 4,
      complaintId: "COM-GHI456",
      title: "Delayed Feedback",
      filedBy: "Neha Patel",
      date: "2025-11-07",
      status: "pending",
      priority: "low",
      description: "Assignment feedback delayed by more than a week",
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Complaints On Me</h1>
        <p className="text-gray-600">
          View complaints filed against you
        </p>
      </div>

      {/* Complaints Cards */}
      <div className="space-y-4">
        {complaints.map((complaint) => (
          <div key={complaint.id} className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                  <span className={`inline-block px-3 py-1 rounded text-sm font-semibold ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mt-1">Complaint ID: {complaint.complaintId}</p>
              </div>
              <div className={`text-lg ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority.toUpperCase()}
              </div>
            </div>

            <p className="text-gray-700 mb-3">{complaint.description}</p>

            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <p className="font-semibold">Filed by: <span className="text-gray-800">{complaint.filedBy}</span></p>
                <p className="text-xs text-gray-500 mt-1">{complaint.date}</p>
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
            {complaints.filter(c => c.priority === "high").length}
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
    </div>
  );
}
