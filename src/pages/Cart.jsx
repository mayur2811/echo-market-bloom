
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  
  // Calculate subtotal
  const subtotal = getCartTotal();
  
  // Calculate shipping (free for orders over $100)
  const shipping = subtotal > 100 ? 0 : 10;
  
  // Calculate total
  const total = subtotal - discount + shipping;
  
  // Handle coupon application
  const handleApplyCoupon = () => {
    // In a real app, you'd validate the coupon with the backend
    // For this demo, we'll just apply a discount for any non-empty coupon
    if (couponCode.trim()) {
      const discountAmount = Math.min(subtotal * 0.1, 50); // 10% discount, max $50
      setDiscount(discountAmount);
      alert(`Coupon applied! You saved $${discountAmount.toFixed(2)}`);
    } else {
      alert('Please enter a valid coupon code');
    }
  };
  
  return (
    <div className="exclusive-container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-exclusive-red">Home</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-gray-900">Cart</li>
        </ol>
      </nav>
      
      {cartItems.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-2 md:px-6">Product</th>
                  <th className="py-4 px-2 md:px-6">Price</th>
                  <th className="py-4 px-2 md:px-6">Quantity</th>
                  <th className="py-4 px-2 md:px-6">Subtotal</th>
                  <th className="py-4 px-2 md:px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {cartItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-2 md:px-6">
                      <div className="flex items-center">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <div>
                          <Link to={`/products/${item.id}`} className="hover:text-exclusive-red font-medium">
                            {item.name}
                          </Link>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-6">${item.discountPrice.toFixed(2)}</td>
                    <td className="py-4 px-2 md:px-6">
                      <div className="flex items-center border rounded-md overflow-hidden w-24">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="px-3 py-1">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-2 md:px-6 font-medium">
                      ${(item.discountPrice * item.quantity).toFixed(2)}
                    </td>
                    <td className="py-4 px-2 md:px-6">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-exclusive-red"
                      >
                        <X size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex justify-between mt-6">
              <Link 
                to="/products"
                className="flex items-center text-gray-600 hover:text-exclusive-red"
              >
                <ArrowLeft size={20} className="mr-2" />
                Return to Shop
              </Link>
              <button 
                className="exclusive-btn"
              >
                Update Cart
              </button>
            </div>
          </div>
          
          {/* Cart summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Cart Total</h2>
              
              <div className="space-y-3 border-b pb-4 mb-4">
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
              
              <Link
                to="/checkout"
                className="w-full exclusive-btn text-center block"
              >
                Process to checkout
              </Link>
            </div>
            
            {/* Coupon */}
            <div className="mt-6">
              <div className="flex">
                <input
                  type="text"
                  className="exclusive-input rounded-r-none"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button 
                  className="bg-exclusive-red text-white px-4 py-2 rounded-r hover:bg-exclusive-darkRed transition-colors"
                  onClick={handleApplyCoupon}
                >
                  Apply Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link
            to="/products"
            className="exclusive-btn inline-block"
          >
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
