
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setCurrentUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Register function
  async function register(userData, userType = 'buyer') {
    try {
      // In a real app, we would use API call to register
      // For now, we'll simulate it
      const newUser = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        userType,
        createdAt: new Date().toISOString()
      };
      
      // Store in localStorage for demo purposes
      localStorage.setItem('user', JSON.stringify(newUser));
      setCurrentUser(newUser);
      toast.success(`Successfully registered as ${userType}`);
      return newUser;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed");
      throw error;
    }
  }

  // Login function
  async function login(email, password, userType = 'buyer') {
    try {
      // In a real app, we would verify credentials with an API
      // For this demo, we'll just pretend it's successful
      
      // Demo users
      const demoUsers = {
        buyer: {
          id: 'buyer-001',
          name: 'Demo Buyer',
          email: 'buyer@example.com',
          userType: 'buyer'
        },
        seller: {
          id: 'seller-001',
          name: 'Demo Seller',
          email: 'seller@example.com',
          userType: 'seller'
        }
      };
      
      // Simulate login with demo user based on userType
      const user = demoUsers[userType];
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);
      toast.success(`Logged in as ${user.name}`);
      return user;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
      throw error;
    }
  }

  // Logout function
  function logout() {
    localStorage.removeItem('user');
    setCurrentUser(null);
    toast.info("Logged out successfully");
  }

  const value = {
    currentUser,
    userType: currentUser?.userType || null,
    register,
    login,
    logout,
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
