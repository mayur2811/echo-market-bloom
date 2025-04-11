
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";

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
        // Verify token and extract user data
        const decodedToken = jwtDecode(storedToken);
        
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        } else {
          // Valid token
          setToken(storedToken);
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Failed to parse stored token:", error);
        localStorage.removeItem('token');
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
      
      // Create a mock JWT token
      const tokenPayload = {
        sub: newUser.id,
        name: newUser.name,
        email: newUser.email,
        userType: newUser.userType,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      };
      
      // In a real app, the token would be created by the server
      // This is just a simulation
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(tokenPayload))}.mockSignature`;
      
      // Store in localStorage
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      
      setToken(mockToken);
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
      
      // Create a mock JWT token
      const tokenPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      };
      
      // In a real app, the token would be created by the server
      // This is just a simulation
      const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(tokenPayload))}.mockSignature`;
      
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(user));
      
      setToken(mockToken);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    toast.info("Logged out successfully");
  }

  const value = {
    currentUser,
    token,
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
