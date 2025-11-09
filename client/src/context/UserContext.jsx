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
  const deleteAccount = () => {
    setUser(null);
    localStorage.removeItem("griefEaseUser");
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
