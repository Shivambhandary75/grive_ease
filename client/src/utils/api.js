// API Configuration and Helper Functions
const API_BASE_URL = "http://localhost:8080";

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Set token in localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Remove token from localStorage
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Get user data from localStorage
export const getUserData = () => {
  const userData = localStorage.getItem("userData");
  return userData ? JSON.parse(userData) : null;
};

// Set user data in localStorage
export const setUserData = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
};

// Remove user data from localStorage
export const removeUserData = () => {
  localStorage.removeItem("userData");
};

// API Request Helper with Authentication
export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle unauthorized
    if (response.status === 401) {
      removeToken();
      removeUserData();
      window.location.href = "/auth";
      throw new Error("Unauthorized - Please login again");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Cannot connect to server. Please make sure the server is running."
      );
    }
    throw error;
  }
};

// API Request for FormData (file uploads)
export const apiRequestFormData = async (endpoint, formData, options = {}) => {
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: "POST",
    ...options,
    headers,
    body: formData,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Handle unauthorized
    if (response.status === 401) {
      removeToken();
      removeUserData();
      window.location.href = "/auth";
      throw new Error("Unauthorized - Please login again");
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `API Error: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch")) {
      throw new Error(
        "Cannot connect to server. Please make sure the server is running."
      );
    }
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData) =>
    apiRequest("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),

  login: (credentials) =>
    apiRequest("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  getMe: () => apiRequest("/api/auth/me"),

  updateProfile: (userData) =>
    apiRequest("/api/auth/me", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
};

// Complaints API
export const complaintsAPI = {
  lodge: (complaintData) =>
    apiRequest("/api/complaints/lodge", {
      method: "POST",
      body: JSON.stringify(complaintData),
    }),

  getHistory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/complaints/history${query ? `?${query}` : ""}`);
  },

  getComplaintsOnMe: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(
      `/api/complaints/complaints-on-me${query ? `?${query}` : ""}`
    );
  },

  getInstitutionalComplaints: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(
      `/api/complaints/institutional/all${query ? `?${query}` : ""}`
    );
  },

  getDetails: (complaintId) => apiRequest(`/api/complaints/${complaintId}`),

  updateStatus: (complaintId, status, comments) =>
    apiRequest(`/api/complaints/${complaintId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, comments }),
    }),

  startPoll: (complaintId) =>
    apiRequest(`/api/complaints/${complaintId}/start-poll`, {
      method: "POST",
    }),

  vote: (complaintId, vote) =>
    apiRequest(`/api/complaints/${complaintId}/vote`, {
      method: "POST",
      body: JSON.stringify({ vote }),
    }),

  endPoll: (complaintId) =>
    apiRequest(`/api/complaints/${complaintId}/end-poll`, {
      method: "POST",
    }),
};

// Institutions API
export const institutionsAPI = {
  getAll: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/api/institution/browse${query ? `?${query}` : ""}`);
  },

  getById: (id) => apiRequest(`/api/institution/${id}`),

  getStats: (id) => apiRequest(`/api/institution/${id}/stats`),

  getDashboardStats: () => apiRequest(`/api/institution/dashboard/stats`),

  addReview: (id, reviewData) =>
    apiRequest(`/api/institution/${id}/review`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    }),

  search: (searchTerm) =>
    apiRequest(`/api/institution/search?q=${encodeURIComponent(searchTerm)}`),
};

// AI RAG API
export const aiAPI = {
  query: (question) =>
    apiRequest("/api/ask-ai-rag/query", {
      method: "POST",
      body: JSON.stringify({ question }),
    }),

  upload: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return apiRequestFormData("/api/ask-ai-rag/upload", formData);
  },

  ingestText: (text, metadata) =>
    apiRequest("/api/ask-ai-rag/ingest-text", {
      method: "POST",
      body: JSON.stringify({ text, metadata }),
    }),

  health: () => apiRequest("/api/ask-ai-rag/health"),
};

export default {
  authAPI,
  complaintsAPI,
  institutionsAPI,
  aiAPI,
  getToken,
  setToken,
  removeToken,
  getUserData,
  setUserData,
  removeUserData,
};
