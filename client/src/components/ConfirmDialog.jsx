import { useState } from "react";

export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirm", cancelText = "Cancel", isDangerous = false }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full mx-4">
        {/* Header */}
        <div className={`px-6 py-4 border-b-2 ${isDangerous ? "border-red-300 bg-red-50" : "border-green-300 bg-green-50"}`}>
          <h2 className={`text-xl font-bold ${isDangerous ? "text-red-800" : "text-green-800"}`}>
            {title}
          </h2>
        </div>

        {/* Message */}
        <div className="px-6 py-6">
          <p className="text-gray-700 text-base">
            {message}
          </p>
        </div>

        {/* Footer - Buttons */}
        <div className="px-6 py-4 border-t-2 border-gray-200 flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-semibold"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-6 py-2 rounded-lg transition font-semibold text-white ${
              isDangerous
                ? "bg-red-600 hover:bg-red-700"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
