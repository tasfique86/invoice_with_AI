import React, { createContext, useContext, useEffect, useState } from "react";
import { BASE_URL } from "../utils/apiPath";
import { axiosInstance } from "../utils/axiosInstance";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      if (token && userStr) {
        const userData = JSON.parse(userStr);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed");
      logout();
    } finally {
      setLoading(false);
    }
  };

  //login function
  const login = async (userData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false);
  };

  //signup function
  const signup = async (userData) => {
    const response = await axiosInstance.post(
      `${BASE_URL}/api/auth/register`,
      userData,
    );
    setUser(response.data.user);
    localStorage.setItem("token", response.data.token);
  };
  //logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  const updateUser = async (updateUserData) => {
    const newUserData = { ...user, ...updateUserData };
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  const value = {
    user,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
    checkAuthStatus,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
