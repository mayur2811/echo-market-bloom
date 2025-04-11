import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, userType } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginType, setLoginType] = useState('buyer');
  const [loading, setLoading] = useState(false);
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      if (userType === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, navigate, userType]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    
    try {
      const user = await login(email, password, loginType);
      toast.success(`Welcome back, ${user.name}!`);
      
      // Redirect based on user type
      if (user.userType === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Toast is already displayed by the AuthContext
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block w-1/2 bg-gray-100">
        <div className="h-full w-full bg-cover bg-center" style={{ 
          backgroundImage: `url(https://source.unsplash.com/random/800x600/?shopping)` 
        }}>
          <div className="h-full w-full bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-white text-center p-8">
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-xl">Sign in to continue your shopping experience</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-8">Log in to Exclusive</h1>
          
          <p className="text-gray-600 mb-6">Enter your details below</p>
          
          {/* User type selector */}
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setLoginType('buyer')}
              className={`py-2 px-4 border-b-2 ${
                loginType === 'buyer' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
              }`}
            >
              Customer
            </button>
            <button 
              onClick={() => setLoginType('seller')}
              className={`py-2 px-4 border-b-2 ${
                loginType === 'seller' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
              }`}
            >
              Seller
            </button>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email or Phone Number"
                className="exclusive-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className="exclusive-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <button
                type="submit"
                className="exclusive-btn"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              
              <Link to="/forgot-password" className="text-exclusive-red hover:underline">
                Forgot Password?
              </Link>
            </div>
          </form>
          
          {/* Demo account info */}
          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <p className="text-sm text-gray-600 mb-1">API Connection:</p>
            <p className="text-xs text-gray-600">Connecting to: {import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}</p>
          </div>
          
          <div className="text-center">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="text-exclusive-red hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
