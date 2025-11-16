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
      const matchesType = filterType === "all" || inst.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "complaints") return b.complaints - a.complaints;
      if (sortBy === "resolved") return b.resolved - a.resolved;
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
                    key={institution.id}
                    onClick={() => setSelectedInstitution(institution)}
                    className={`p-4 cursor-pointer transition hover:bg-gray-50 ${
                      selectedInstitution?.id === institution.id
                        ? "bg-green-50 border-l-4 border-green-600"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img src={institution.image} alt={institution.name} className="w-8 h-8 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 truncate">
                          {institution.name}
                        </p>
                        <p className="text-xs text-gray-500">{institution.type}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <span className={`font-bold ${getRatingColor(institution.rating)}`}>
                            ★ {institution.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({institution.totalReviews})
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
                  <div className="flex items-center gap-4">
                    <span className="text-6xl">{selectedInstitution.image}</span>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">
                        {selectedInstitution.name}
                      </h2>
                      <p className="text-gray-600">{selectedInstitution.type}</p>
                      <p className="text-gray-600">📍 {selectedInstitution.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-4xl font-bold ${getRatingColor(selectedInstitution.rating)}`}>
                      ★ {selectedInstitution.rating}
                    </p>
                    <p className="text-sm text-gray-500">
                      Based on {selectedInstitution.totalReviews} reviews
                    </p>
                  </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {selectedInstitution.categories.map((category, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full font-semibold"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>

              {/* Statistics Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                  <p className="text-sm text-gray-600 font-semibold">Total Complaints</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {selectedInstitution.complaints}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
                  <p className="text-sm text-gray-600 font-semibold">Resolved</p>
                  <p className="text-3xl font-bold text-green-600">
                    {selectedInstitution.resolved}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
                  <p className="text-sm text-gray-600 font-semibold">Resolution Rate</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {getResolutionPercentage(selectedInstitution.resolved, selectedInstitution.complaints)}%
                  </p>
                </div>
              </div>

              {/* Complaint Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  <img src={searchIcon} alt="Complaint Distribution" className="w-5 h-5 inline mr-2" />
                  Complaint Distribution
                </h3>
                <div className="space-y-3">
                  {selectedInstitution.categories.map((category) => (
                    <div key={category} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-gray-700 w-24">
                        {category}
                      </span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: Math.random() * 100 + "%" }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">
                        {Math.floor(Math.random() * 20 + 5)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Reviews */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Reviews</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold text-gray-800">User {i}</p>
                        <p className="text-yellow-500">★★★★★</p>
                      </div>
                      <p className="text-sm text-gray-600">
                        "Great institution with responsive management to complaints."
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                <img src={complaintIcon} alt="Lodge Complaint" className="w-5 h-5" />
                Lodge Complaint for this Institution
              </button>
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
