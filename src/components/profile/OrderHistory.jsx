
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const OrderHistory = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real application, fetch orders from API
    // For demo, we'll use mock data from localStorage
    setLoading(true);
    setTimeout(() => {
      const mockOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      const userOrders = mockOrders.filter(order => order.userId === (currentUser?.id || 'guest'));
      setOrders(userOrders);
      setLoading(false);
    }, 500);
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="text-center py-10">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
          <Link
            to="/products"
            className="exclusive-btn mt-4 inline-block"
          >
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
