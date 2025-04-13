
import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, Mail, CreditCard, Settings, BarChart2 } from 'lucide-react';
import ProfileForm from '../components/profile/ProfileForm';
import OrderHistory from '../components/profile/OrderHistory';

const Profile = () => {
  const { currentUser, logout, isSeller } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      // Initialize mock orders data if not already in localStorage
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      if (existingOrders.length === 0) {
        const mockOrders = [
          {
            id: '12345678-123456',
            userId: currentUser.id || 'guest',
            date: new Date().toISOString(),
            status: 'delivered',
            total: 128.50,
            items: [{ name: 'Product 1', quantity: 2 }]
          },
          {
            id: '23456789-234567',
            userId: currentUser.id || 'guest',
            date: new Date(Date.now() - 86400000).toISOString(),  // yesterday
            status: 'processing',
            total: 75.20,
            items: [{ name: 'Product 2', quantity: 1 }]
          },
          {
            id: '34567890-345678',
            userId: currentUser.id || 'guest',
            date: new Date(Date.now() - 172800000).toISOString(),  // 2 days ago
            status: 'pending',
            total: 220.00,
            items: [{ name: 'Product 3', quantity: 3 }]
          },
          {
            id: '45678901-456789',
            userId: currentUser.id || 'guest',
            date: new Date(Date.now() - 259200000).toISOString(),  // 3 days ago
            status: 'delivered',
            total: 55.99,
            items: [{ name: 'Product 4', quantity: 1 }]
          },
          {
            id: '56789012-567890',
            userId: currentUser.id || 'guest',
            date: new Date(Date.now() - 345600000).toISOString(),  // 4 days ago
            status: 'delivered',
            total: 149.99,
            items: [{ name: 'Product 5', quantity: 1 }]
          }
        ];
        localStorage.setItem('orders', JSON.stringify(mockOrders));
      }
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null; // Don't render anything if not logged in
  }

  return (
    <div className="exclusive-container py-10">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-gray-100 p-3 rounded-full">
                <User size={30} className="text-exclusive-red" />
              </div>
              <div>
                <h2 className="font-bold">{currentUser?.name || 'User'}</h2>
                <p className="text-gray-500 text-sm">{currentUser?.email}</p>
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-3">
              {isSeller && (
                <Link 
                  to="/seller/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-exclusive-red w-full py-3"
                >
                  <BarChart2 size={20} />
                  <span>Seller Dashboard</span>
                </Link>
              )}
              
              <Link 
                to="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-exclusive-red w-full py-3"
              >
                <User size={20} />
                <span>Personal Info</span>
              </Link>
              
              <Link 
                to="/profile/orders"
                className="flex items-center space-x-2 text-gray-700 hover:text-exclusive-red w-full py-3"
              >
                <Package size={20} />
                <span>My Orders</span>
              </Link>
              
              <Link 
                to="/profile/settings"
                className="flex items-center space-x-2 text-gray-700 hover:text-exclusive-red w-full py-3"
              >
                <Settings size={20} />
                <span>Account Settings</span>
              </Link>
              
              <button 
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-700 hover:text-exclusive-red w-full py-3"
              >
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Main content */}
        <div className="md:col-span-2">
          {/* Personal Information */}
          <ProfileForm />
          
          {/* Recent Orders */}
          <OrderHistory />
          
          <div className="mt-6 space-y-4">
            {isSeller && (
              <Link
                to="/seller/dashboard"
                className="exclusive-btn block w-full text-center"
              >
                Go to Seller Dashboard
              </Link>
            )}
            <Link
              to="/products"
              className={`${isSeller ? 'border border-exclusive-red text-exclusive-red hover:bg-exclusive-red hover:text-white' : 'exclusive-btn'} block w-full text-center`}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
