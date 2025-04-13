
import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Package, 
  Star 
} from 'lucide-react';
import sellerService from '../../services/sellerService';
import { toast } from 'sonner';

const DashboardSummary = () => {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    avgRating: 0,
    revenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await sellerService.getDashboardData();
        
        // In a real application, the data would come from the API
        // For now, we'll use mock data
        setStats({
          totalSales: 25890,
          totalOrders: 285,
          totalCustomers: 128,
          totalProducts: 64,
          avgRating: 4.8,
          revenue: 13450
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, trend, color }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <p className={`text-xs mt-2 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.percentage}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <Icon className={`text-${color}-500`} size={20} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="animate-pulse flex justify-between">
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-300 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard 
        icon={DollarSign}
        title="Total Revenue" 
        value={`$${stats.revenue.toLocaleString()}`} 
        trend={{ positive: true, percentage: 12 }}
        color="green"
      />
      
      <StatCard 
        icon={ShoppingBag}
        title="Total Sales" 
        value={stats.totalSales.toLocaleString()} 
        trend={{ positive: true, percentage: 8.2 }}
        color="blue"
      />
      
      <StatCard 
        icon={Package}
        title="Total Orders" 
        value={stats.totalOrders.toLocaleString()} 
        trend={{ positive: true, percentage: 5.3 }}
        color="purple"
      />
      
      <StatCard 
        icon={Users}
        title="Total Customers" 
        value={stats.totalCustomers.toLocaleString()} 
        trend={{ positive: true, percentage: 2.8 }}
        color="amber"
      />
      
      <StatCard 
        icon={ShoppingBag}
        title="Total Products" 
        value={stats.totalProducts.toLocaleString()} 
        color="indigo"
      />
      
      <StatCard 
        icon={Star}
        title="Average Rating" 
        value={stats.avgRating.toFixed(1)} 
        trend={{ positive: true, percentage: 0.5 }}
        color="yellow"
      />
    </div>
  );
};

export default DashboardSummary;
