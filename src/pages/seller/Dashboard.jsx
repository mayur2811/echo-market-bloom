
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Package, Users, ShoppingBag, Settings, BarChart2, PlusCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';

const SellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, isSeller } = useAuth();
  const { getProductsBySeller, products } = useProducts();
  
  const [stats, setStats] = useState({
    productCount: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeCustomers: 0
  });
  
  // Check if user is a seller, redirect if not
  useEffect(() => {
    if (!isSeller) {
      navigate('/login');
    }
  }, [isSeller, navigate]);
  
  // Calculate stats
  useEffect(() => {
    if (currentUser) {
      const sellerProducts = getProductsBySeller(currentUser.id);
      
      // In a real app, these would come from the backend
      // For this demo, we'll use some simulated data
      setStats({
        productCount: sellerProducts.length,
        totalSales: Math.floor(Math.random() * 500),
        totalRevenue: Math.floor(Math.random() * 50000),
        activeCustomers: Math.floor(Math.random() * 100)
      });
    }
  }, [currentUser, getProductsBySeller, products]);
  
  // Sidebar links
  const sidebarLinks = [
    { 
      name: 'Overview', 
      path: '/seller/dashboard', 
      icon: <BarChart2 size={20} /> 
    },
    { 
      name: 'Products', 
      path: '/seller/dashboard/products', 
      icon: <Package size={20} /> 
    },
    { 
      name: 'Orders', 
      path: '/seller/dashboard/orders', 
      icon: <ShoppingBag size={20} /> 
    },
    { 
      name: 'Customers', 
      path: '/seller/dashboard/customers', 
      icon: <Users size={20} /> 
    },
    { 
      name: 'Settings', 
      path: '/seller/dashboard/settings', 
      icon: <Settings size={20} /> 
    }
  ];
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="bg-white w-64 hidden md:flex flex-col h-screen sticky top-0 border-r">
          {/* Seller info */}
          <div className="p-4 border-b">
            <h2 className="font-bold text-lg">Seller Dashboard</h2>
            <p className="text-sm text-gray-600">{currentUser?.name}</p>
          </div>
          
          {/* Navigation */}
          <nav className="flex-grow p-4">
            <ul className="space-y-2">
              {sidebarLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center p-2 rounded-lg ${
                      (location.pathname === link.path || 
                       (link.path !== '/seller/dashboard' && location.pathname.startsWith(link.path)))
                        ? 'bg-gray-100 text-exclusive-red'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <span className="mr-3">{link.icon}</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Add new product button */}
          <div className="p-4 border-t">
            <Link
              to="/seller/dashboard/products/new"
              className="flex items-center justify-center bg-exclusive-red text-white p-2 rounded-lg hover:bg-exclusive-darkRed transition-colors"
            >
              <PlusCircle size={20} className="mr-2" />
              <span>Add New Product</span>
            </Link>
          </div>
          
          {/* Logout */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-exclusive-red w-full"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </aside>
        
        {/* Main content */}
        <div className="flex-grow">
          {/* Render outlet if on a subpage, otherwise show dashboard overview */}
          {location.pathname !== '/seller/dashboard' ? (
            <Outlet />
          ) : (
            <div className="p-6">
              <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
              
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500">Products</h3>
                    <Package size={24} className="text-exclusive-red" />
                  </div>
                  <p className="text-3xl font-semibold mt-2">{stats.productCount}</p>
                  <p className="text-sm text-green-600 mt-2">
                    +12% from last month
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500">Total Sales</h3>
                    <ShoppingBag size={24} className="text-blue-500" />
                  </div>
                  <p className="text-3xl font-semibold mt-2">{stats.totalSales}</p>
                  <p className="text-sm text-green-600 mt-2">
                    +18% from last month
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500">Revenue</h3>
                    <BarChart2 size={24} className="text-green-500" />
                  </div>
                  <p className="text-3xl font-semibold mt-2">${stats.totalRevenue}</p>
                  <p className="text-sm text-green-600 mt-2">
                    +24% from last month
                  </p>
                </div>
                
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-500">Customers</h3>
                    <Users size={24} className="text-purple-500" />
                  </div>
                  <p className="text-3xl font-semibold mt-2">{stats.activeCustomers}</p>
                  <p className="text-sm text-green-600 mt-2">
                    +8% from last month
                  </p>
                </div>
              </div>
              
              {/* Recent orders */}
              <div className="bg-white rounded-lg shadow mb-8">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Order ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Amount</th>
                        <th className="px-6 py-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">#ORD-71257</td>
                        <td className="px-6 py-4">John Doe</td>
                        <td className="px-6 py-4">Gaming Monitor</td>
                        <td className="px-6 py-4">April 8, 2025</td>
                        <td className="px-6 py-4">$650.00</td>
                        <td className="px-6 py-4">
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Delivered
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">#ORD-71258</td>
                        <td className="px-6 py-4">Jane Smith</td>
                        <td className="px-6 py-4">Gaming Keyboard</td>
                        <td className="px-6 py-4">April 7, 2025</td>
                        <td className="px-6 py-4">$159.99</td>
                        <td className="px-6 py-4">
                          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Processing
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4">#ORD-71259</td>
                        <td className="px-6 py-4">Robert Johnson</td>
                        <td className="px-6 py-4">Gaming Mouse</td>
                        <td className="px-6 py-4">April 6, 2025</td>
                        <td className="px-6 py-4">$69.99</td>
                        <td className="px-6 py-4">
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Shipped
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-center">
                  <Link
                    to="/seller/dashboard/orders"
                    className="text-exclusive-red hover:underline"
                  >
                    View all orders
                  </Link>
                </div>
              </div>
              
              {/* Top Products */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h2 className="text-lg font-semibold">Top Products</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3">Product</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Sold</th>
                        <th className="px-6 py-3">Revenue</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center">
                          <img
                            src="https://source.unsplash.com/random/40x40/?monitor"
                            alt="Product"
                            className="w-10 h-10 object-cover mr-3"
                          />
                          <span>Gaming Monitor</span>
                        </td>
                        <td className="px-6 py-4">$650.00</td>
                        <td className="px-6 py-4">52 units</td>
                        <td className="px-6 py-4">$33,800</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center">
                          <img
                            src="https://source.unsplash.com/random/40x40/?keyboard"
                            alt="Product"
                            className="w-10 h-10 object-cover mr-3"
                          />
                          <span>Gaming Keyboard</span>
                        </td>
                        <td className="px-6 py-4">$159.99</td>
                        <td className="px-6 py-4">78 units</td>
                        <td className="px-6 py-4">$12,479</td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center">
                          <img
                            src="https://source.unsplash.com/random/40x40/?mouse"
                            alt="Product"
                            className="w-10 h-10 object-cover mr-3"
                          />
                          <span>Gaming Mouse</span>
                        </td>
                        <td className="px-6 py-4">$69.99</td>
                        <td className="px-6 py-4">93 units</td>
                        <td className="px-6 py-4">$6,509</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-4 text-center">
                  <Link
                    to="/seller/dashboard/products"
                    className="text-exclusive-red hover:underline"
                  >
                    View all products
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
