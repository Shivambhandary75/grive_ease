import { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Create the provider component
export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Initialize from localStorage if available
    const savedUser = localStorage.getItem("griefEaseUser");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Function to set user and save to localStorage
  const setUserData = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("griefEaseUser", JSON.stringify(userData));
    }
  };

  // Function to logout and clear user data
  const logout = () => {
    setUser(null);
    localStorage.removeItem("griefEaseUser");
  };

  // Function to delete account
  const deleteAccount = async () => {
    try {
      const token = user?.token;
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:8080/api/auth/me", {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete account:", error);
        throw new Error(error.message || "Failed to delete account");
      }

      // Clear local state after successful deletion
      setUser(null);
      localStorage.removeItem("griefEaseUser");
      console.log("Account deleted successfully");
    } catch (error) {
      console.error("Error deleting account:", error);
      // Still clear local state even if API call fails
      setUser(null);
      localStorage.removeItem("griefEaseUser");
    }
  };

  // Function to update user profile
  const updateUserProfile = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    setUserData(newUserData);
  };

  const value = {
    user,
    setUserData,
    logout,
    deleteAccount,
    updateUserProfile,
    isLoggedIn: user !== null,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the UserContext
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
