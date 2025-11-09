import { useState } from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../../assets/user.png";
import filesIcon from "../../assets/files.png";
import ConfirmDialog from "../ConfirmDialog";
import { useUser } from "../../context/UserContext";

export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { user, updateUserProfile, deleteAccount } = useUser();
  
  const [formData, setFormData] = useState({...user, avatar: user.avatar || userIcon, collegeIdFile: user.collegeIdFile || null});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          avatar: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCollegeIdChange = (e) => {
    setFormData({
      ...formData,
      collegeIdFile: e.target.files[0] || null,
    });
  };

  const handleSave = () => {
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({...user, avatar: user.avatar || userIcon, collegeIdFile: user.collegeIdFile || null});
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
        <p className="text-gray-600">
          Manage your account information and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center gap-6 mb-8 pb-8 border-b">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center overflow-hidden">
            <img src={formData.avatar || userIcon} alt="Profile" className="w-20 h-20 object-cover" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <span className="inline-block mt-2 px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        {!isEditing ? (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 font-semibold">Full Name</p>
              <p className="text-gray-800 text-lg">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Email Address</p>
              <p className="text-gray-800 text-lg">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">Account Type</p>
              <p className="text-gray-800 text-lg">
                {user.role === "student" ? "Student" : user.role === "teacher" ? "Teacher/Staff" : "Institutional"}
              </p>
            </div>
            {user.collegeIdFile && (
              <div>
                <p className="text-sm text-gray-500 font-semibold">College ID (Verified)</p>
                <p className="text-green-700 text-sm font-semibold">✓ {user.collegeIdFile.name || "File uploaded"}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500 font-semibold">Member Since</p>
              <p className="text-gray-800 text-lg">November 2025</p>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Profile Avatar
              </label>
              <div className="flex items-center gap-4">
                <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center overflow-hidden">
                  <img src={formData.avatar || userIcon} alt="Profile Preview" className="w-24 h-24 object-cover" />
                </div>
                <label className="flex-1 px-4 py-3 bg-blue-50 border-2 border-blue-300 rounded-lg hover:bg-blue-100 cursor-pointer transition text-center font-semibold text-blue-700">
                  Choose Avatar
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Account Type
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher/Staff</option>
                <option value="institutional">Institutional</option>
              </select>
            </div>

            {/* College ID Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                College ID (for verification)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                <input
                  type="file"
                  onChange={handleCollegeIdChange}
                  className="hidden"
                  id="college-id-upload"
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <label
                  htmlFor="college-id-upload"
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

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">My Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
            <p className="text-sm text-gray-600 font-semibold">Complaints Filed</p>
            <p className="text-3xl font-bold text-blue-600">12</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-600">
            <p className="text-sm text-gray-600 font-semibold">Resolved</p>
            <p className="text-3xl font-bold text-green-600">8</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-600">
            <p className="text-sm text-gray-600 font-semibold">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">3</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-600">
            <p className="text-sm text-gray-600 font-semibold">Success Rate</p>
            <p className="text-3xl font-bold text-purple-600">67%</p>
          </div>
        </div>
      </div>

      {/* Account Settings */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">Email Notifications</p>
              <p className="text-sm text-gray-600">Receive updates about your complaints</p>
            </div>
            <input type="checkbox" defaultChecked className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">Two-Factor Authentication</p>
              <p className="text-sm text-gray-600">Add extra security to your account</p>
            </div>
            <input type="checkbox" className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-semibold text-gray-800">Privacy Mode</p>
              <p className="text-sm text-gray-600">Keep your complaints anonymous</p>
            </div>
            <input type="checkbox" className="w-6 h-6 cursor-pointer" />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-8">
        <h3 className="text-2xl font-bold text-red-800 mb-4">Danger Zone</h3>
        <p className="text-red-700 mb-4">
          Be careful with these actions. They cannot be undone.
        </p>
        <button onClick={() => setShowDeleteDialog(true)} className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition">
           Delete Account
        </button>

        {/* Delete Account Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Delete Account"
          message="Are you absolutely sure you want to delete your account? This action cannot be undone!"
          confirmText="Delete Account"
          cancelText="Cancel"
          isDangerous={true}
          onConfirm={() => {
            setShowDeleteDialog(false);
            deleteAccount();
            navigate("/");
          }}
          onCancel={() => setShowDeleteDialog(false)}
        />
      </div>
    </div>
  );
}
