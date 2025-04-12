
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "sonner";

const Checkout = () => {
  const { currentUser } = useAuth();
  const { cartItems, getCartTotal } = useCart();
  const navigate = useNavigate();
  
  // Safely calculate cart total with fallback
  const cartTotal = (() => {
    try {
      // First try using the getCartTotal function if available
      if (typeof getCartTotal === 'function') {
        return getCartTotal() || 0;
      }
      
      // Fallback calculation if getCartTotal is not available
      return cartItems.reduce((total, item) => {
        const price = parseFloat(item.discountPrice || item.price || 0);
        const quantity = parseInt(item.quantity || 1, 10);
        return total + (price * quantity);
      }, 0);
    } catch (err) {
      console.error("Error calculating cart total:", err);
      return 0;
    }
  })();
  
  const [shippingDetails, setShippingDetails] = useState({
    fullName: currentUser?.name || "",
    email: currentUser?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
    phone: ""
  });
  
  const [errors, setErrors] = useState({});
  
  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails({
      ...shippingDetails,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!shippingDetails.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!shippingDetails.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(shippingDetails.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!shippingDetails.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!shippingDetails.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!shippingDetails.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!shippingDetails.zipCode.trim()) {
      newErrors.zipCode = "Zip code is required";
    }
    
    if (!shippingDetails.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    navigate("/payment", { state: { orderData: shippingDetails } });
  };
  
  return (
    <div className="exclusive-container py-10">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                <div>
                  <label htmlFor="fullName" className="block text-gray-700 text-sm mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`exclusive-input ${errors.fullName ? "border-red-500" : ""}`}
                    value={shippingDetails.fullName}
                    onChange={handleInputChange}
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`exclusive-input ${errors.email ? "border-red-500" : ""}`}
                    value={shippingDetails.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-gray-700 text-sm mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className={`exclusive-input ${errors.address ? "border-red-500" : ""}`}
                    value={shippingDetails.address}
                    onChange={handleInputChange}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-gray-700 text-sm mb-1">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`exclusive-input ${errors.city ? "border-red-500" : ""}`}
                    value={shippingDetails.city}
                    onChange={handleInputChange}
                  />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-gray-700 text-sm mb-1">
                    State/Province*
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    className={`exclusive-input ${errors.state ? "border-red-500" : ""}`}
                    value={shippingDetails.state}
                    onChange={handleInputChange}
                  />
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
                </div>
                
                <div>
                  <label htmlFor="zipCode" className="block text-gray-700 text-sm mb-1">
                    Zip/Postal Code*
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    className={`exclusive-input ${errors.zipCode ? "border-red-500" : ""}`}
                    value={shippingDetails.zipCode}
                    onChange={handleInputChange}
                  />
                  {errors.zipCode && <p className="text-red-500 text-xs mt-1">{errors.zipCode}</p>}
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-gray-700 text-sm mb-1">
                    Country*
                  </label>
                  <select
                    id="country"
                    name="country"
                    className="exclusive-input"
                    value={shippingDetails.country}
                    onChange={handleInputChange}
                  >
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 text-sm mb-1">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className={`exclusive-input ${errors.phone ? "border-red-500" : ""}`}
                    value={shippingDetails.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              
              <button
                type="submit"
                className="exclusive-btn w-full mt-8 py-3"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map(item => {
                // Make sure we have valid price and quantity
                const price = parseFloat(item.discountPrice || item.price || 0);
                const quantity = parseInt(item.quantity || 1, 10);
                const itemTotal = price * quantity;
                
                return (
                  <div key={`${item.id}-${item.selectedSize || 'default'}`} className="flex items-center">
                    <div className="bg-gray-100 rounded w-16 h-16 flex items-center justify-center overflow-hidden mr-4">
                      <img
                        src={item.image || item.imageUrl || '/placeholder.svg'}
                        alt={item.name}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-sm font-medium leading-tight">{item.name}</h3>
                      <p className="text-gray-500 text-xs">
                        Qty: {quantity}
                        {item.selectedSize && ` | Size: ${item.selectedSize}`}
                      </p>
                    </div>
                    <p className="font-medium">${itemTotal.toFixed(2)}</p>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">Free</span>
              </div>
              <div className="flex justify-between border-t border-dashed pt-4 mt-4">
                <span className="font-bold">Total</span>
                <span className="font-bold">${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
