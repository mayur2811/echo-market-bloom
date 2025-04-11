
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Download, Filter, CreditCard, DollarSign, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const PaymentManagement = () => {
  const { currentUser, isSeller } = useAuth();
  const navigate = useNavigate();
  
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  
  // Check if user is a seller
  useEffect(() => {
    if (!isSeller) {
      toast.error("Access denied: Seller account required");
      navigate('/login');
    }
  }, [isSeller, navigate]);
  
  // Fetch payments data (simulated)
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        // In a real app, this would be an API call to fetch payments
        // For now, we'll create mock data
        const mockPayments = [
          {
            id: 'PAY-1234',
            date: '2025-04-10',
            customer: { name: 'John Smith', email: 'john@example.com', id: 'cust-001' },
            amount: 129.99,
            status: 'completed',
            order: { id: 'ORD-5678', items: 2 },
          },
          {
            id: 'PAY-1235',
            date: '2025-04-09',
            customer: { name: 'Sarah Johnson', email: 'sarah@example.com', id: 'cust-002' },
            amount: 499.99,
            status: 'completed',
            order: { id: 'ORD-5679', items: 1 },
          },
          {
            id: 'PAY-1236',
            date: '2025-04-08',
            customer: { name: 'Michael Brown', email: 'michael@example.com', id: 'cust-003' },
            amount: 89.99,
            status: 'completed',
            order: { id: 'ORD-5680', items: 3 },
          },
          {
            id: 'PAY-1237',
            date: '2025-04-07',
            customer: { name: 'Emma Wilson', email: 'emma@example.com', id: 'cust-004' },
            amount: 149.99,
            status: 'pending',
            order: { id: 'ORD-5681', items: 1 },
          },
          {
            id: 'PAY-1238',
            date: '2025-04-06',
            customer: { name: 'Daniel Lee', email: 'daniel@example.com', id: 'cust-005' },
            amount: 75.50,
            status: 'failed',
            order: { id: 'ORD-5682', items: 2 },
          }
        ];
        
        setTimeout(() => {
          setPayments(mockPayments);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error('Failed to load payment data');
        setLoading(false);
      }
    };
    
    fetchPayments();
  }, []);
  
  // Filter payments
  const filteredPayments = payments.filter(payment => {
    if (filter === 'all') return true;
    return payment.status === filter;
  });
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Calculate statistics
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2);
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-semibold">Payment Management</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => toast.success('Report downloading...')}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            <Download size={16} />
            <span>Download Report</span>
          </button>
          <button
            onClick={() => {
              setLoading(true);
              setTimeout(() => setLoading(false), 500);
              toast.success('Refreshed payment data');
            }}
            className="flex items-center space-x-2 bg-exclusive-red text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>
      </div>
      
      {/* Statistics cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Total Revenue</h3>
            <DollarSign className="text-green-500 h-6 w-6" />
          </div>
          <p className="text-3xl font-semibold mt-2">${totalAmount}</p>
          <p className="text-sm text-green-600 mt-2">+12.5% from last month</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Completed Payments</h3>
            <CreditCard className="text-blue-500 h-6 w-6" />
          </div>
          <p className="text-3xl font-semibold mt-2">{completedPayments}</p>
          <p className="text-sm text-green-600 mt-2">100% success rate</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500">Pending Payments</h3>
            <RefreshCw className="text-orange-500 h-6 w-6" />
          </div>
          <p className="text-3xl font-semibold mt-2">{pendingPayments}</p>
          <p className="text-sm text-gray-600 mt-2">Processing in 24-48 hours</p>
        </div>
      </div>
      
      {/* Filter controls */}
      <div className="flex items-center mb-6 bg-white p-3 rounded-md shadow">
        <Filter size={18} className="text-gray-500 mr-2" />
        <span className="text-gray-700 mr-3">Filter:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-md ${
              filter === 'all' 
                ? 'bg-exclusive-red text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded-md ${
              filter === 'completed' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1 rounded-md ${
              filter === 'pending' 
                ? 'bg-yellow-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('failed')}
            className={`px-3 py-1 rounded-md ${
              filter === 'failed' 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Failed
          </button>
        </div>
      </div>
      
      {/* Payments table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Payment ID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Date</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Customer</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Order ID</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Amount</th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-4 text-center">Loading payment data...</td>
              </tr>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">{payment.id}</td>
                  <td className="py-3 px-4">{formatDate(payment.date)}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p>{payment.customer.name}</p>
                      <p className="text-sm text-gray-500">{payment.customer.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className="font-medium">{payment.order.id}</span>
                      <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">
                        {payment.order.items} {payment.order.items === 1 ? 'item' : 'items'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">${payment.amount.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No payments found matching your filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentManagement;
