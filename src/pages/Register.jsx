import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Register = () => {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [userType, setUserType] = useState('buyer');
  const [loading, setLoading] = useState(false);
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData, userType);
      toast.success(`Account created successfully! Welcome to Exclusive`);
      
      // Redirect based on user type
      if (userType === 'seller') {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Error is already handled by AuthContext
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
              <h2 className="text-4xl font-bold mb-4">Create an account</h2>
              <p className="text-xl">Join our community of shoppers and sellers</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Register form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold mb-8">Create an account</h1>
          
          <p className="text-gray-600 mb-6">Enter your details below</p>
          
          {/* User type selector */}
          <div className="flex border-b mb-6">
            <button 
              onClick={() => setUserType('buyer')}
              className={`py-2 px-4 border-b-2 ${
                userType === 'buyer' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
              }`}
            >
              Customer
            </button>
            <button 
              onClick={() => setUserType('seller')}
              className={`py-2 px-4 border-b-2 ${
                userType === 'seller' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
              }`}
            >
              Seller
            </button>
          </div>
          
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="exclusive-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="exclusive-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="exclusive-input"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
              />
            </div>
            
            <div className="mb-6">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="exclusive-input"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="mb-6">
              <button
                type="submit"
                className="exclusive-btn w-full"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : `Create ${userType === 'seller' ? 'Seller' : 'Customer'} Account`}
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="text-exclusive-red hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
