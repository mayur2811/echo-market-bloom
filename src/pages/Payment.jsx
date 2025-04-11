
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Payment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { cartItems, clearCart, cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const orderData = location.state?.orderData;
  
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    if (!orderData) {
      navigate('/checkout');
      return;
    }
    
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, [currentUser, navigate, orderData]);
  
  const handlePayment = () => {
    setIsLoading(true);
    
    // In a real app, you would get order ID from backend
    // For demo purposes, we're generating it on client-side
    const orderId = 'order_' + Math.random().toString(36).substring(2, 15);
    
    // Create a new Razorpay instance
    const options = {
      key: "rzp_test_YourTestKey", // Replace with your test key
      amount: Math.round(cartTotal * 100), // Amount in paisa
      currency: "INR",
      name: "Exclusive Store",
      description: "Purchase payment",
      order_id: orderId,
      handler: function (response) {
        handlePaymentSuccess(response);
      },
      prefill: {
        name: currentUser.name,
        email: currentUser.email,
      },
      theme: {
        color: "#DB4444",
      },
    };
    
    // Open Razorpay checkout modal
    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      setIsLoading(false);
    } catch (error) {
      console.error("Razorpay error:", error);
      setIsLoading(false);
      // Fallback to demo payment for testing
      setTimeout(() => {
        handlePaymentSuccess({
          razorpay_payment_id: 'pay_' + Math.random().toString(36).substring(2, 15),
          razorpay_order_id: orderId,
          razorpay_signature: 'sign_' + Math.random().toString(36).substring(2, 15)
        });
      }, 1500);
    }
  };
  
  const handlePaymentSuccess = (response) => {
    // In real app, verify payment with backend
    console.log("Payment successful!", response);
    
    // Create order record
    const order = {
      id: response.razorpay_order_id || 'order_' + Math.random().toString(36).substring(2, 15),
      userId: currentUser.id,
      items: cartItems,
      total: cartTotal,
      shippingDetails: orderData,
      paymentId: response.razorpay_payment_id,
      date: new Date().toISOString(),
      status: 'processing'
    };
    
    // Store in localStorage for demo
    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));
    
    // Show success and clear cart
    setPaymentSuccess(true);
    clearCart();
    
    // Send email notification (mock)
    setTimeout(() => {
      toast.success(`Payment confirmation sent to ${currentUser.email}`);
    }, 1000);
  };
  
  const goToOrders = () => {
    navigate('/profile');
  };
  
  if (paymentSuccess) {
    return (
      <div className="exclusive-container py-20">
        <div className="max-w-lg mx-auto text-center">
          <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully. We've sent a confirmation to your email address.
          </p>
          <button onClick={goToOrders} className="exclusive-btn px-8 py-3">
            View My Orders
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="exclusive-container py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Your Purchase</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <CreditCard className="mr-2" />
            Payment Details
          </h2>
          
          <div className="mb-6">
            <div className="border rounded-md p-4 bg-gray-50">
              <p className="font-medium">Order Total: ${cartTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500">{cartItems.length} item(s)</p>
            </div>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-100 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-500 mr-3 mt-0.5" size={20} />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Demo Payment:</strong> This is a test implementation. No real payment will be processed.
                  Click the button below to simulate a payment.
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={handlePayment}
            disabled={isLoading}
            className="exclusive-btn w-full py-3 flex justify-center items-center"
          >
            {isLoading ? "Processing..." : "Pay Now"}
          </button>
        </div>
        
        <div className="text-center">
          <button
            onClick={() => navigate('/checkout')}
            className="text-exclusive-red hover:underline"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
