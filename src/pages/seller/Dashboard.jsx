
import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart2, 
  Package, 
  User, 
  CreditCard, 
  Settings, 
  LogOut, 
  Home,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardSummary from '../../components/seller/DashboardSummary';

const Dashboard = () => {
  const { currentUser, isSeller, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if user is a seller
  useEffect(() => {
    if (!currentUser) {
      toast.error("Please log in to access the seller dashboard");
      navigate('/login');
      return;
    }
    
    if (!isSeller) {
      toast.error("Access denied: Seller account required");
      navigate('/');
    }
  }, [currentUser, isSeller, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  // Determine if we're on the main dashboard or a sub-page
  const isMainDashboard = location.pathname === '/seller/dashboard';
  
  // Determine active link
  const isLinkActive = (path) => {
    return location.pathname.startsWith(path);
  };
  
  if (!currentUser || !isSeller) {
    return null; // Don't render anything if not a seller
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col">
        {/* Dashboard header */}
        <header className="bg-white shadow z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex items-center">
                <Link to="/" className="text-exclusive-red flex items-center space-x-2">
                  <span className="font-bold text-xl">Exclusive</span>
                </Link>
                <nav className="hidden md:flex ml-10 space-x-4">
                  <Link 
                    to="/"
                    className="text-gray-600 hover:text-exclusive-red px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Store Front
                  </Link>
                </nav>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <div className="relative">
                  <User className="text-gray-600" size={20} />
                </div>
              </div>
            </div>
          </div>
        </header>
        
        <div className="flex flex-col md:flex-row flex-grow">
          {/* Sidebar navigation */}
          <div className="md:w-64 bg-white shadow-sm md:h-screen md:sticky top-0 z-10">
            <div className="p-4">
              <div className="mb-8 pt-4">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Dashboard
                </h3>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/seller/dashboard"
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isLinkActive('/seller/dashboard') && !isLinkActive('/seller/dashboard/products') && !isLinkActive('/seller/dashboard/profile') && !isLinkActive('/seller/dashboard/payments')
                        ? 'bg-exclusive-red text-white'
                        : 'text-gray-700 hover:text-exclusive-red'
                    }`}
                  >
                    <BarChart2 className="mr-3 h-5 w-5" aria-hidden="true" />
                    Overview
                  </Link>
                  <Link
                    to="/seller/dashboard/products"
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isLinkActive('/seller/dashboard/products')
                        ? 'bg-exclusive-red text-white'
                        : 'text-gray-700 hover:text-exclusive-red'
                    }`}
                  >
                    <Package className="mr-3 h-5 w-5" aria-hidden="true" />
                    Products
                  </Link>
                  <Link
                    to="/seller/dashboard/payments"
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isLinkActive('/seller/dashboard/payments')
                        ? 'bg-exclusive-red text-white'
                        : 'text-gray-700 hover:text-exclusive-red'
                    }`}
                  >
                    <CreditCard className="mr-3 h-5 w-5" aria-hidden="true" />
                    Payments
                  </Link>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Account
                </h3>
                <div className="mt-2 space-y-1">
                  <Link
                    to="/seller/dashboard/profile"
                    className={`group flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      isLinkActive('/seller/dashboard/profile')
                        ? 'bg-exclusive-red text-white'
                        : 'text-gray-700 hover:text-exclusive-red'
                    }`}
                  >
                    <User className="mr-3 h-5 w-5" aria-hidden="true" />
                    Profile
                  </Link>
                  <Link
                    to="/seller/dashboard/settings"
                    className="group flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-exclusive-red"
                  >
                    <Settings className="mr-3 h-5 w-5" aria-hidden="true" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left group flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:text-exclusive-red"
                  >
                    <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content */}
          <main className="flex-1 p-6">
            {/* Breadcrumb */}
            <nav className="mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-500 hover:text-exclusive-red">
                    <Home size={16} />
                    <span className="sr-only">Home</span>
                  </Link>
                </li>
                <li>
                  <ChevronRight size={14} className="text-gray-400" />
                </li>
                <li>
                  <Link to="/seller/dashboard" className="text-gray-500 hover:text-exclusive-red">
                    Seller Dashboard
                  </Link>
                </li>
                {!isMainDashboard && (
                  <>
                    <li>
                      <ChevronRight size={14} className="text-gray-400" />
                    </li>
                    <li className="text-gray-900 font-medium">
                      {location.pathname.includes('products') 
                        ? 'Products' 
                        : location.pathname.includes('profile')
                        ? 'Profile'
                        : location.pathname.includes('payments')
                        ? 'Payments'
                        : 'Settings'}
                    </li>
                  </>
                )}
              </ol>
            </nav>
            
            {/* Page heading */}
            <header className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">
                {isMainDashboard 
                  ? 'Seller Dashboard' 
                  : location.pathname.includes('products') 
                  ? 'Product Management' 
                  : location.pathname.includes('profile')
                  ? 'Seller Profile'
                  : location.pathname.includes('payments')
                  ? 'Payment Management'
                  : 'Settings'}
              </h1>
            </header>
            
            {/* Main dashboard content */}
            {isMainDashboard ? (
              <div>
                {/* Dashboard summary */}
                <DashboardSummary />
                
                {/* Quick actions */}
                <div className="mb-8">
                  <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link
                      to="/seller/dashboard/products/new"
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-exclusive-red hover:shadow-sm transition-all flex items-center justify-center"
                    >
                      <div className="text-center">
                        <Package size={24} className="mx-auto mb-2 text-exclusive-red" />
                        <span className="text-gray-900 font-medium">Add New Product</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/seller/dashboard/profile"
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-exclusive-red hover:shadow-sm transition-all flex items-center justify-center"
                    >
                      <div className="text-center">
                        <User size={24} className="mx-auto mb-2 text-exclusive-red" />
                        <span className="text-gray-900 font-medium">Update Profile</span>
                      </div>
                    </Link>
                    
                    <Link
                      to="/seller/dashboard/products"
                      className="bg-white border border-gray-200 rounded-lg p-6 hover:border-exclusive-red hover:shadow-sm transition-all flex items-center justify-center"
                    >
                      <div className="text-center">
                        <BarChart2 size={24} className="mx-auto mb-2 text-exclusive-red" />
                        <span className="text-gray-900 font-medium">View Analytics</span>
                      </div>
                    </Link>
                  </div>
                </div>
                
                {/* Recent orders section could go here */}
                
              </div>
            ) : (
              <Outlet />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
