
import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  ShoppingBag, 
  Settings, 
  BarChart2, 
  PlusCircle, 
  LogOut, 
  User,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useProducts } from '../../context/ProductContext';
import { toast } from 'sonner';
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel
} from '@/components/ui/sidebar';

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
      toast.error("Access denied: Seller account required");
      navigate('/login');
    }
  }, [isSeller, navigate]);
  
  // Calculate stats
  useEffect(() => {
    if (currentUser) {
      const sellerProducts = getProductsBySeller(currentUser.id);
      
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
      icon: <BarChart2 className="w-5 h-5" /> 
    },
    { 
      name: 'Products', 
      path: '/seller/dashboard/products', 
      icon: <Package className="w-5 h-5" /> 
    },
    { 
      name: 'Orders', 
      path: '/seller/dashboard/orders', 
      icon: <ShoppingBag className="w-5 h-5" /> 
    },
    { 
      name: 'Customers', 
      path: '/seller/dashboard/customers', 
      icon: <Users className="w-5 h-5" /> 
    },
    { 
      name: 'Payments', 
      path: '/seller/dashboard/payments', 
      icon: <CreditCard className="w-5 h-5" /> 
    },
    { 
      name: 'Profile', 
      path: '/seller/dashboard/profile', 
      icon: <User className="w-5 h-5" /> 
    },
    { 
      name: 'Settings', 
      path: '/seller/dashboard/settings', 
      icon: <Settings className="w-5 h-5" /> 
    }
  ];
  
  const handleLogout = () => {
    logout();
    toast.success("Successfully logged out");
    navigate('/login');
  };
  
  const isActive = (path) => {
    if (path === '/seller/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Render the layout with sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full">
          <Sidebar>
            <SidebarHeader>
              <div className="px-3 py-2">
                <Link to="/seller/dashboard" className="flex items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-exclusive-red text-white">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="ml-2 text-lg font-semibold">Seller Portal</span>
                </Link>
              </div>
              <div className="px-3 pb-2">
                <div className="text-sm text-sidebar-foreground/60">
                  Welcome, {currentUser?.name}
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarLinks.map((link) => (
                      <SidebarMenuItem key={link.path}>
                        <SidebarMenuButton 
                          isActive={isActive(link.path)}
                          onClick={() => navigate(link.path)}
                          tooltip={link.name}
                        >
                          {link.icon}
                          <span>{link.name}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarSeparator />
              <SidebarGroup>
                <SidebarGroupLabel>Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton 
                        onClick={() => navigate('/seller/dashboard/products/new')}
                        tooltip="Add New Product"
                      >
                        <PlusCircle className="w-5 h-5" />
                        <span>Add New Product</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={handleLogout}
                    tooltip="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <div className="container py-6">
              {location.pathname === '/seller/dashboard' ? (
                <div>
                  <h1 className="text-2xl font-semibold mb-6">Dashboard Overview</h1>
                  
                  {/* Stats cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500">Products</h3>
                        <Package className="text-exclusive-red h-6 w-6" />
                      </div>
                      <p className="text-3xl font-semibold mt-2">{stats.productCount}</p>
                      <p className="text-sm text-green-600 mt-2">
                        +12% from last month
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500">Total Sales</h3>
                        <ShoppingBag className="text-blue-500 h-6 w-6" />
                      </div>
                      <p className="text-3xl font-semibold mt-2">{stats.totalSales}</p>
                      <p className="text-sm text-green-600 mt-2">
                        +18% from last month
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500">Revenue</h3>
                        <BarChart2 className="text-green-500 h-6 w-6" />
                      </div>
                      <p className="text-3xl font-semibold mt-2">${stats.totalRevenue}</p>
                      <p className="text-sm text-green-600 mt-2">
                        +24% from last month
                      </p>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow p-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-gray-500">Customers</h3>
                        <Users className="text-purple-500 h-6 w-6" />
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
                                className="w-10 h-10 object-cover mr-3 rounded"
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
                                className="w-10 h-10 object-cover mr-3 rounded"
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
                                className="w-10 h-10 object-cover mr-3 rounded"
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
              ) : (
                <Outlet />
              )}
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default SellerDashboard;
