import { useState, useEffect } from "react";
import schoolIcon from "../../assets/school.png";
import searchIcon from "../../assets/search-interface-symbol.png";
import complaintIcon from "../../assets/complain.png";
import { institutionsAPI } from "../../utils/api";

export default function BrowseInstitutions() {
  const [institutions, setInstitutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedInstitution, setSelectedInstitution] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);
      const response = await institutionsAPI.getAll();
      setInstitutions(response.institutions || response || []);
    } catch (err) {
      setError(err.message || "Failed to fetch institutions");
    } finally {
      setLoading(false);
    }
  };

  const filteredInstitutions = institutions
    .filter((inst) => {
      const matchesSearch = inst.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return (b.rating?.average || 0) - (a.rating?.average || 0);
      if (sortBy === "complaints") return (b.stats?.totalComplaints || 0) - (a.stats?.totalComplaints || 0);
      if (sortBy === "resolved") return (b.stats?.resolvedComplaints || 0) - (a.stats?.resolvedComplaints || 0);
      return 0;
    });

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 4) return "text-blue-600";
    if (rating >= 3.5) return "text-yellow-600";
    if (rating >= 2) return "text-red-600";
    return "text-red-600";
  };

  const getResolutionPercentage = (resolved, total) => {
    return Math.round((resolved / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Browse Institutions</h1>
        <p className="text-gray-600">
          Explore institutions, view complaint statistics, and read reviews
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg">
          <p className="font-semibold">Error: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-gray-600">Loading institutions...</p>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search institutions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="all">All Types</option>
              <option value="University">University</option>
              <option value="College">College</option>
              <option value="School">School</option>
            </select>
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="rating">Sort by Rating</option>
              <option value="complaints">Sort by Complaints</option>
              <option value="resolved">Sort by Resolution Rate</option>
            </select>
          </div>
        </div>
      </div>

      {/* Institutions Grid and Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institutions List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-green-600 text-white p-4">
              <h2 className="font-semibold">Institutions ({filteredInstitutions.length})</h2>
            </div>
            <div className="divide-y max-h-96 overflow-y-auto">
              {filteredInstitutions.length > 0 ? (
                filteredInstitutions.map((institution) => (
                  <div
                    key={institution._id}
                    onClick={() => setSelectedInstitution(institution)}
                    className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                      selectedInstitution?._id === institution._id
                        ? "bg-green-50 border-l-4 border-green-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 flex-shrink-0 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">{institution.name.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {institution.name}
                        </p>
                        <p className="text-xs text-gray-500">{institution.address?.city || institution.address?.state || 'Location not specified'}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`font-bold ${getRatingColor(institution.rating?.average || 0)}`}>
                            ★ {(institution.rating?.average || 0).toFixed(1)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({institution.rating?.count || 0} complaints)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No institutions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Institution Details */}
        <div className="lg:col-span-2">
          {selectedInstitution ? (
            <div className="space-y-4">
              {/* Main Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {selectedInstitution.name}
                    </h2>
                    <p className="text-gray-600">Email: {selectedInstitution.email}</p>
                    <p className="text-gray-600">Location: {selectedInstitution.address?.city || ''}{selectedInstitution.address?.city && selectedInstitution.address?.state ? ', ' : ''}{selectedInstitution.address?.state || ''}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getRatingColor(selectedInstitution.rating?.average || 0)}`}>
                      ★ {(selectedInstitution.rating?.average || 0).toFixed(1)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Based on {selectedInstitution.rating?.count || 0} complaints
                    </p>
                  </div>
                </div>

                {/* Departments */}
                {selectedInstitution.departments && selectedInstitution.departments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedInstitution.departments.map((dept, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 font-semibold">Total Complaints</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {selectedInstitution.stats?.totalComplaints || 0}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-600 font-semibold">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedInstitution.stats?.resolvedComplaints || 0}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                  <p className="text-sm text-gray-600 font-semibold">Resolution Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {(selectedInstitution.stats?.resolutionRate || 0).toFixed(0)}%
                  </p>
                </div>
              </div>

              {/* Complaint Status */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Complaint Status Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{selectedInstitution.stats?.pendingComplaints || 0}</p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-600">In Progress</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedInstitution.stats?.inProgressComplaints || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              <p className="text-lg">Select an institution to view details</p>
            </div>
          )}
        </div>
      </div>
        </>
      )}
    </div>
  );
}
