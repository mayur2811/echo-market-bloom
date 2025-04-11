
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Package, LogOut, Mail, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Profile = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    // In a real application, fetch orders from API
    // For demo, we'll use mock data from localStorage
    const mockOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = mockOrders.filter(order => order.userId === currentUser.id);
    setOrders(userOrders);
  }, [currentUser, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
            
            <div className="border-t pt-4">
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
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Full Name</label>
                <p className="font-medium">{currentUser?.name || 'Not set'}</p>
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Email</label>
                <p className="font-medium">{currentUser?.email}</p>
              </div>
              <div>
                <label className="block text-gray-600 text-sm mb-1">Account Type</label>
                <p className="font-medium capitalize">{currentUser?.userType || 'Buyer'}</p>
              </div>
            </div>
          </div>
          
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
            
            {orders.length > 0 ? (
              <div className="divide-y">
                {orders.map(order => (
                  <div key={order.id} className="py-4">
                    <div className="flex justify-between mb-2">
                      <p className="font-medium">Order #{order.id.substring(0, 8)}</p>
                      <span className={`px-2 py-1 rounded text-xs ${
                        order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-2">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    <p className="font-bold">${order.total.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <Package size={40} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">You haven't placed any orders yet.</p>
              </div>
            )}
            
            <button
              onClick={() => navigate('/products')}
              className="exclusive-btn w-full mt-6"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
