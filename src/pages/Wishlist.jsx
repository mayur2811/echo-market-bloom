
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingCart, Loader } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';
import WishlistService from '../services/wishlistService';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  // Fetch wishlist items on component mount
  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        if (isAuthenticated) {
          const response = await WishlistService.getWishlistItems();
          setWishlistItems(response.data || []);
        } else {
          // For demo purposes, show empty state for unauthenticated users
          setWishlistItems([]);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        toast.error('Failed to load wishlist items');
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, [isAuthenticated]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await WishlistService.removeFromWishlist(productId);
      setWishlistItems(prevItems => 
        prevItems.filter(item => item.productId !== productId)
      );
      toast.success('Product removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove product from wishlist');
    }
  };

  const handleAddToCart = (product) => {
    addToCart({
      id: product.productId,
      name: product.name,
      price: product.price,
      discountPrice: product.discountPrice,
      image: product.imageUrl
    }, 1);
    
    // Optionally remove from wishlist after adding to cart
    // handleRemoveFromWishlist(product.productId);
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice, discountPrice) => {
    if (!originalPrice || !discountPrice) return 0;
    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader className="animate-spin" size={32} />
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="exclusive-container">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium mb-4">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">
              Add items you love to your wishlist. Review them anytime and easily move them to the cart.
            </p>
            <Link to="/products" className="exclusive-btn">
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left">Product</th>
                  <th className="py-4 px-6 text-left">Price</th>
                  <th className="py-4 px-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {wishlistItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                          <img
                            src={item.imageUrl || "https://via.placeholder.com/150"}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                        <div className="ml-4">
                          <Link to={`/products/${item.productId}`} className="font-medium hover:text-exclusive-red">
                            {item.name}
                          </Link>
                          {item.discountPrice && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                              {calculateDiscount(item.price, item.discountPrice)}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        {item.discountPrice ? (
                          <div>
                            <span className="font-medium">${item.discountPrice}</span>
                            <span className="ml-2 text-sm text-gray-500 line-through">${item.price}</span>
                          </div>
                        ) : (
                          <span className="font-medium">${item.price}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center space-x-3">
                        <button 
                          onClick={() => handleAddToCart(item)} 
                          className="bg-exclusive-red text-white p-2 rounded-full hover:bg-red-700"
                          title="Add to Cart"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemoveFromWishlist(item.productId)} 
                          className="bg-gray-100 p-2 rounded-full hover:bg-gray-200"
                          title="Remove from Wishlist"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
