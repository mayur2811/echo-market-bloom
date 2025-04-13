import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate totals whenever cartItems change
  useEffect(() => {
    if (!loading) {
      calculateTotals();
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, loading]);

  function calculateTotals() {
    let count = 0;
    let subtotal = 0;

    cartItems.forEach(item => {
      count += item.quantity;
      subtotal += (item.discountPrice || item.price) * item.quantity;
    });

    setCartCount(count);
    setCartSubtotal(subtotal);
  }

  function addToCart(product, quantity = 1) {
    setCartItems(prevItems => {
      // Look for item with same ID, size and color
      const existingItemIndex = prevItems.findIndex(item => 
        item.id === product.id && 
        item.selectedSize === product.selectedSize && 
        item.selectedColor === product.selectedColor
      );
      
      // If item exists with same options, update quantity
      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`Updated quantity in cart`);
        return updatedItems;
      }
      
      // Otherwise add new item
      toast.success(`Added ${product.name} to cart`);
      return [...prevItems, {
        ...product,
        quantity
      }];
    });
  }

  function updateCartItem(id, options) {
    setCartItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === id && 
            item.selectedSize === options.selectedSize && 
            item.selectedColor === options.selectedColor) {
          return { ...item, ...options };
        }
        return item;
      });
    });
  }

  function removeFromCart(id, selectedSize, selectedColor) {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => 
        !(item.id === id && 
          item.selectedSize === selectedSize && 
          item.selectedColor === selectedColor)
      );
      toast.info(`Item removed from cart`);
      return newItems;
    });
  }

  function clearCart() {
    setCartItems([]);
    toast.info('Cart has been cleared');
  }

  const value = {
    cartItems,
    cartCount,
    cartSubtotal,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
