
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
          handleTokenExpiration();
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
        handleTokenExpiration();
      }
    }
    setLoading(false);
  }, []);

  // Handle token expiration
  const handleTokenExpiration = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setToken(null);
    toast.error("Session expired. Please log in again.");
  };

  // Register function
  async function register(userData, userType = 'buyer') {
    try {
      // In a real app, we would use API call to register
      // For now, we'll simulate it with proper JWT structure
      const newUser = {
        ...userData,
        id: Math.random().toString(36).substr(2, 9),
        userType,
        createdAt: new Date().toISOString()
      };
      
      // Create a proper JWT token structure
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
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(tokenPayload));
      const signature = btoa("secret_signature_key"); // In a real app this would be encrypted
      const mockToken = `${header}.${payload}.${signature}`;
      
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
          userType: 'buyer',
          profileImage: 'https://source.unsplash.com/random/200x200/?portrait'
        },
        seller: {
          id: 'seller-001',
          name: 'Demo Seller',
          email: 'seller@example.com',
          userType: 'seller',
          company: 'Demo Store',
          profileImage: 'https://source.unsplash.com/random/200x200/?business'
        }
      };
      
      // Simulate login with demo user based on userType
      const user = demoUsers[userType];
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      // Create a proper JWT token structure
      const tokenPayload = {
        sub: user.id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 24 hours
      };
      
      // Create a more realistic JWT token
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify(tokenPayload));
      const signature = btoa("secret_signature_key"); // In a real app this would be encrypted
      const mockToken = `${header}.${payload}.${signature}`;
      
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

  // Update user profile
  async function updateProfile(updatedData) {
    try {
      const updatedUser = {
        ...currentUser,
        ...updatedData,
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, this would be an API call
      // For now, we'll just update local storage
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setCurrentUser(updatedUser);
      
      toast.success("Profile updated successfully");
      return updatedUser;
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile");
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

  // Check token validity on interval
  useEffect(() => {
    // Check token every 5 minutes
    const tokenCheckInterval = setInterval(() => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp < currentTime) {
            handleTokenExpiration();
          }
        } catch (error) {
          handleTokenExpiration();
        }
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
