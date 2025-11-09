const multer = require("multer");
const path = require("path");
const fs = require("fs");
const aiConfig = require("../config/aiConfig");

/**
 * File Upload Utility for AI Features
 * Handles file uploads for chat attachments and document processing
 */

// Create upload directory if it doesn't exist
const uploadDir = aiConfig.fileUpload.uploadDir;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = aiConfig.fileUpload.allowedMimeTypes;

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`), false);
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: aiConfig.fileUpload.maxFileSize,
  },
});

/**
 * Extract text from uploaded file
 * @param {string} filePath - Path to the uploaded file
 * @returns {Promise<string>} - Extracted text content
 */
async function extractTextFromFile(filePath) {
  // TODO: Implement file text extraction
  // Support for:
  // - PDF files (use pdf-parse)
  // - Images (use OCR - tesseract)
  // - Word documents (use docx-parser)
  // - Text files (simple read)

  console.log("Extracting text from:", filePath);
  return "File content extracted";
}

/**
 * Validate file before processing
 * @param {Object} file - File object from multer
 * @returns {Object} - Validation result
 */
function validateFile(file) {
  const maxSize = aiConfig.fileUpload.maxFileSize;
  const allowedMimes = aiConfig.fileUpload.allowedMimeTypes;

  if (!file) {
    return { valid: false, error: "No file provided" };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / 1024 / 1024}MB`,
    };
  }

  if (!allowedMimes.includes(file.mimetype)) {
    return { valid: false, error: `File type ${file.mimetype} is not allowed` };
  }

  return { valid: true };
}

/**
 * Delete uploaded file
 * @param {string} fileName - Name of file to delete
 * @returns {Promise<boolean>} - Success status
 */
async function deleteUploadedFile(fileName) {
  try {
    const filePath = path.join(uploadDir, fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Get file URL from file name
 * @param {string} fileName - Name of uploaded file
 * @returns {string} - File URL
 */
function getFileUrl(fileName) {
  return `/uploads/ai-files/${fileName}`;
}

module.exports = {
  upload,
  extractTextFromFile,
  validateFile,
  deleteUploadedFile,
  getFileUrl,
};
