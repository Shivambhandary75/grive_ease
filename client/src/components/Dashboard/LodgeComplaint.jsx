import { useState } from "react";
import filesIcon from "../../assets/files.png";

export default function LodgeComplaint() {
  const [formData, setFormData] = useState({
    title: "",
    category: "academic",
    complaintAgainst: "",
    severity: "medium",
    description: "",
    collegeIdFile: null,
    attachments: [],
    anonymous: false,
  });

  const [submitted, setSubmitted] = useState(false);

  const categories = [
    { value: "academic", label: "Academic" },
    { value: "facilities", label: "Facilities" },
    { value: "safety", label: "Safety & Security" },
    { value: "food", label: "Food & Canteen" },
    { value: "staff", label: "Staff Conduct" },
    { value: "other", label: "Other" },
  ];

  const severityLevels = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCollegeIdChange = (e) => {
    setFormData({
      ...formData,
      collegeIdFile: e.target.files[0] || null,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      attachments: Array.from(e.target.files),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Complaint Data:", formData);
    // TODO: Send to backend
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        title: "",
        category: "academic",
        complaintAgainst: "",
        severity: "medium",
        description: "",
        collegeIdFile: null,
        attachments: [],
        anonymous: false,
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Lodge a Complaint</h1>
        <p className="text-gray-600">
          Share your concerns and help us improve our institutions
        </p>
      </div>

      {submitted && (
        <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg">
          <p className="font-semibold">✓ Complaint submitted successfully!</p>
          <p className="text-sm">Your complaint ID: #COM-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Brief title of your complaint"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Category and Severity Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Severity Level <span className="text-red-500">*</span>
              </label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {severityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Institution */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Complaint Against <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="complaintAgainst"
              value={formData.complaintAgainst}
              onChange={handleChange}
              placeholder="Name of person, teacher, or entity"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* College ID Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              College ID (for verification) <span className="text-red-500">*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
              <input
                type="file"
                onChange={handleCollegeIdChange}
                className="hidden"
                id="college-id-input"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                required
              />
              <label
                htmlFor="college-id-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <img src={filesIcon} alt="Upload College ID" className="w-8 h-8 mb-2" />
                <p className="font-semibold text-gray-700">Click to upload College ID</p>
                <p className="text-sm text-gray-500">
                  (PDF, Image, or Document)
                </p>
              </label>
              {formData.collegeIdFile && (
                <div className="mt-3 text-left">
                  <p className="text-sm font-semibold text-green-700">
                    ✓ File selected: {formData.collegeIdFile.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your complaint..."
              required
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition">
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
              />
              <label
                htmlFor="file-input"
                className="cursor-pointer flex flex-col items-center"
              >
                <img src={filesIcon} alt="Upload Files" className="w-8 h-8 mb-2" />
                <p className="font-semibold text-gray-700">Click to upload files</p>
                <p className="text-sm text-gray-500">
                  (Images, PDFs, or documents up to 10MB each)
                </p>
              </label>
              {formData.attachments.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Selected files:
                  </p>
                  <ul className="space-y-1">
                    {Array.from(formData.attachments).map((file, idx) => (
                      <li key={idx} className="text-sm text-gray-600">
                        ✓ {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Anonymous Checkbox */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="anonymous"
              id="anonymous"
              checked={formData.anonymous}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-700">
              Submit this complaint anonymously
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Submit Complaint
            </button>
            <button
              type="reset"
              className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Tips Section */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3"> Tips for Filing a Complaint</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>✓ Be specific and provide detailed information</li>
          <li>✓ Include dates and times of the incident if possible</li>
          <li>✓ Attach supporting evidence (photos, documents, etc.)</li>
          <li>✓ Choose the correct category for faster resolution</li>
          <li>✓ Check the severity level carefully</li>
        </ul>
      </div>
    </div>
  );
}
