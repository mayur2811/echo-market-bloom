
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingCart, Loader } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateCart = () => {
    // Instead of a button that doesn't do anything,
    // redirect to products page to continue shopping
    navigate('/products');
    toast.info('Continue shopping for more products');
  };

  const handleQuantityChange = (productId, value) => {
    if (value > 0) {
      updateQuantity(productId, value);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="exclusive-container">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <ShoppingCart size={64} className="mx-auto" />
            </div>
            <h3 className="text-xl font-medium mb-4">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link to="/products" className="exclusive-btn">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-4">Product</th>
                      <th className="text-center p-4">Quantity</th>
                      <th className="text-right p-4">Price</th>
                      <th className="text-right p-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td className="p-4">
                          <div className="flex items-center">
                            <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                              <img 
                                src={item.image || "https://via.placeholder.com/150"} 
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <Link 
                                to={`/products/${item.id}`} 
                                className="font-medium hover:text-exclusive-red"
                              >
                                {item.name}
                              </Link>
                              {item.selectedSize && (
                                <div className="text-sm text-gray-500">
                                  Size: {item.selectedSize}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <div className="flex items-center border rounded-md">
                              <button
                                className="px-3 py-1 border-r focus:outline-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                                className="w-12 text-center py-1 border-none focus:outline-none focus:ring-0"
                              />
                              <button
                                className="px-3 py-1 border-l focus:outline-none"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <div>
                            {item.discountPrice ? (
                              <>
                                <div className="font-medium">${(item.discountPrice * item.quantity).toFixed(2)}</div>
                                <div className="text-sm text-gray-500 line-through">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </div>
                              </>
                            ) : (
                              <div className="font-medium">
                                ${(item.price * item.quantity).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <button 
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex flex-wrap gap-4">
                <Link to="/products" className="exclusive-btn-outline">
                  Continue Shopping
                </Link>
                <button 
                  onClick={handleUpdateCart}
                  className="exclusive-btn"
                >
                  Update Cart
                </button>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-bold">
                    <span>Estimated Total</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Link 
                    to="/checkout"
                    className="exclusive-btn block text-center"
                  >
                    Proceed to Checkout
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
