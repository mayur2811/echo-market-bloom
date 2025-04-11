
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { isAuthenticated, currentUser } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: currentUser?.name?.split(' ')[0] || '',
    lastName: currentUser?.name?.split(' ')[1] || '',
    company: '',
    address: '',
    apartment: '',
    city: '',
    phone: '',
    email: currentUser?.email || '',
    notes: '',
    saveInfo: true,
    paymentMethod: 'card' // 'card', 'cash'
  });
  
  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const total = subtotal - discount + shipping;
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (method) => {
    setFormData({
      ...formData,
      paymentMethod: method
    });
  };
  
  // Handle coupon application
  const handleApplyCoupon = () => {
    // In a real app, you'd validate the coupon with the backend
    if (couponCode.trim()) {
      const discountAmount = Math.min(subtotal * 0.1, 50); // 10% discount, max $50
      setDiscount(discountAmount);
      toast.success(`Coupon applied! You saved $${discountAmount.toFixed(2)}`);
    } else {
      toast.error('Please enter a valid coupon code');
    }
  };
  
  // Handle checkout submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'address', 'city', 'phone', 'email'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
      return;
    }
    
    // In a real app, you would:
    // 1. Send the order to your backend API
    // 2. Process payment with a payment gateway
    // 3. Handle order confirmation
    
    // For this demo, we'll simulate a successful order
    setTimeout(() => {
      toast.success("Order placed successfully!");
      clearCart();
      navigate('/order-confirmation');
    }, 1500);
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="exclusive-container py-16 text-center">
        <h2 className="text-2xl font-medium mb-4">Please log in to continue</h2>
        <p className="mb-8 text-gray-600">You need to be logged in to complete your purchase.</p>
        <Link to="/login" className="exclusive-btn inline-block">Log In</Link>
      </div>
    );
  }
  
  // Redirect to products if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="exclusive-container py-16 text-center">
        <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
        <p className="mb-8 text-gray-600">Add some products to your cart before checking out.</p>
        <Link to="/products" className="exclusive-btn inline-block">Shop Now</Link>
      </div>
    );
  }
  
  return (
    <div className="exclusive-container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-exclusive-red">
              Account
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/account" className="text-gray-500 hover:text-exclusive-red">
              My Account
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/cart" className="text-gray-500 hover:text-exclusive-red">
              Product
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="flex items-center">
            <Link to="/cart" className="text-gray-500 hover:text-exclusive-red">
              View Cart
            </Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-900">CheckOut</li>
        </ol>
      </nav>
      
      <h1 className="text-3xl font-medium mb-6">Billing Details</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Billing form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="firstName" className="block mb-2">
                  First Name*
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="exclusive-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="exclusive-input"
                  required
                />
              </div>
            </div>
            
            <div className="mb-6">
              <label htmlFor="company" className="block mb-2">
                Company Name (optional)
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="exclusive-input"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="address" className="block mb-2">
                Street Address*
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="exclusive-input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="apartment" className="block mb-2">
                Apartment, floor, etc. (optional)
              </label>
              <input
                type="text"
                id="apartment"
                name="apartment"
                value={formData.apartment}
                onChange={handleInputChange}
                className="exclusive-input"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="city" className="block mb-2">
                Town/City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="exclusive-input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="phone" className="block mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="exclusive-input"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="email" className="block mb-2">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="exclusive-input"
                required
              />
            </div>
            
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="saveInfo"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="saveInfo">
                  Save this information for faster check-out next time
                </label>
              </div>
            </div>
          </form>
        </div>
        
        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6">
            {/* Cart items */}
            <div className="mb-6">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <span className="absolute -top-2 -right-2 bg-exclusive-red text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
                        {item.quantity}
                      </span>
                    </div>
                    <span className="ml-3 text-sm">{item.name}</span>
                  </div>
                  <span className="font-medium">${(item.discountPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            {/* Totals */}
            <div className="space-y-3 border-t border-b py-4 mb-6">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between mb-6">
              <span className="font-bold">Total:</span>
              <span className="font-bold text-xl">${total.toFixed(2)}</span>
            </div>
            
            {/* Payment methods */}
            <div className="mb-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Payment Method</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bank"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={() => handlePaymentMethodChange('bank')}
                      className="mr-2"
                    />
                    <label htmlFor="bank" className="flex items-center">
                      <span className="mr-2">Bank</span>
                      <div className="flex space-x-1">
                        <img src="https://cdn-icons-png.flaticon.com/512/5968/5968299.png" alt="Bank" className="h-6" />
                        <img src="https://logowik.com/content/uploads/images/visa-payment-card1873.jpg" alt="Visa" className="h-6" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/2560px-Mastercard-logo.svg.png" alt="Mastercard" className="h-6" />
                      </div>
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="cash"
                      name="paymentMethod"
                      value="cash"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={() => handlePaymentMethodChange('cash')}
                      className="mr-2"
                    />
                    <label htmlFor="cash">
                      Cash on delivery
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Coupon */}
            <div className="mb-6">
              <div className="flex">
                <input
                  type="text"
                  className="exclusive-input rounded-r-none"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  type="button"
                  className="bg-exclusive-red text-white px-4 py-2 rounded-r hover:bg-exclusive-darkRed transition-colors"
                  onClick={handleApplyCoupon}
                >
                  Apply 
                </button>
              </div>
            </div>
            
            <button 
              type="submit"
              onClick={handleSubmit}
              className="w-full exclusive-btn text-center block"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
