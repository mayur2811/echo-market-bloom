
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";
import CartService from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load cart from API if authenticated, otherwise from localStorage
  useEffect(() => {
    const loadCart = async () => {
      try {
        if (isAuthenticated) {
          // Fetch cart from API if user is authenticated
          const response = await CartService.getCartItems();
          setCartItems(response.data || []);
        } else {
          // Load from localStorage for guests
          const storedCart = localStorage.getItem('cart');
          if (storedCart) {
            try {
              setCartItems(JSON.parse(storedCart));
            } catch (error) {
              console.error("Failed to parse stored cart:", error);
            }
          }
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated]);

  // Save cart to localStorage whenever it changes (for guests)
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading, isAuthenticated]);

  // Add item to cart
  async function addToCart(product, quantity = 1) {
    try {
      if (isAuthenticated) {
        // Add to cart via API
        await CartService.addToCart(product.id, quantity);
        
        // Update local state
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            toast.success(`Updated quantity of ${product.name} in cart`);
            return prevItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            toast.success(`Added ${product.name} to cart`);
            return [...prevItems, { ...product, quantity }];
          }
        });
      } else {
        // Add to local cart for guests
        setCartItems(prevItems => {
          const existingItem = prevItems.find(item => item.id === product.id);
          
          if (existingItem) {
            toast.success(`Updated quantity of ${product.name} in cart`);
            return prevItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            toast.success(`Added ${product.name} to cart`);
            return [...prevItems, { ...product, quantity }];
          }
        });
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error(`Failed to add ${product.name} to cart`);
    }
  }

  // Update item quantity
  async function updateQuantity(productId, quantity) {
    if (quantity < 1) return;
    
    try {
      if (isAuthenticated) {
        // Update cart via API
        await CartService.updateCartItem(productId, quantity);
      }
      
      // Update local state
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      toast.error("Failed to update quantity");
    }
  }

  // Remove item from cart
  async function removeFromCart(productId) {
    try {
      if (isAuthenticated) {
        // Remove from cart via API
        await CartService.removeFromCart(productId);
      }
      
      // Update local state
      setCartItems(prevItems => {
        const itemToRemove = prevItems.find(item => item.id === productId);
        if (itemToRemove) {
          toast.info(`Removed ${itemToRemove.name} from cart`);
        }
        return prevItems.filter(item => item.id !== productId);
      });
    } catch (error) {
      console.error("Error removing item from cart:", error);
      toast.error("Failed to remove item");
    }
  }

  // Clear cart
  async function clearCart() {
    try {
      if (isAuthenticated) {
        // Clear cart via API
        await CartService.clearCart();
      }
      
      // Clear local state
      setCartItems([]);
      toast.info("Cart has been cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    }
  }

  // Calculate cart total
  function getCartTotal() {
    return cartItems.reduce((total, item) => {
      const price = item.discountPrice || item.price || 0;
      return total + (price * (item.quantity || 1));
    }, 0);
  }

  const cartTotal = getCartTotal();

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    cartTotal,
    cartCount: cartItems.reduce((count, item) => count + (item.quantity || 1), 0)
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
}
