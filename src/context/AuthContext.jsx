
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import AuthService from '../services/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        // Verify token validity
        if (AuthService.isTokenValid(storedToken)) {
          setToken(storedToken);
          const user = AuthService.getUserFromLocalStorage();
          if (user) {
            setCurrentUser(user);
          }
        } else {
          // Token expired
          handleTokenExpiration();
        }
      } catch (error) {
        console.error("Failed to parse stored token:", error);
        handleTokenExpiration();
      }
    }
    setLoading(false);
  }, []);

  // Handle token expiration
  const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    toast.error("Session expired. Please log in again.");
  };

  // Register function
  async function register(userData, userType = 'buyer') {
    try {
      const newUser = await AuthService.register(userData, userType);
      setCurrentUser(newUser);
      setToken(localStorage.getItem('token'));
      toast.success(`Successfully registered as ${userType}`);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed");
      throw error;
    }
  }

  // Login function
  async function login(email, password, userType = 'buyer') {
    try {
      const user = await AuthService.login(email, password, userType);
      setCurrentUser(user);
      setToken(localStorage.getItem('token'));
      toast.success(`Logged in as ${user.name}`);
      return user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed");
      throw error;
    }
  }

  // Update user profile
  async function updateProfile(updatedData) {
    try {
      const updatedUser = await AuthService.updateProfile(updatedData);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to update profile");
      throw error;
    }
  }

  // Logout function
  async function logout() {
    await AuthService.logout();
    setCurrentUser(null);
    setToken(null);
    toast.info("Logged out successfully");
  }

  // Check token validity on interval
  useEffect(() => {
    const tokenCheckInterval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken && !AuthService.isTokenValid(storedToken)) {
        handleTokenExpiration();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(tokenCheckInterval);
  }, []);

  const value = {
    currentUser,
    token,
    userType: currentUser?.userType || null,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isSeller: currentUser?.userType === 'seller',
    isBuyer: currentUser?.userType === 'buyer'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
