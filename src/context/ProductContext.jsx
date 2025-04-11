
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

// Mock products data
import { products as mockProducts } from '../data/products';

const ProductContext = createContext();

export function useProducts() {
  return useContext(ProductContext);
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize with mock data - this would be replaced with API calls in a real app
  useEffect(() => {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      try {
        const parsedProducts = JSON.parse(storedProducts);
        setProducts(parsedProducts);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(parsedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Failed to parse stored products:", error);
        initializeWithMockData();
      }
    } else {
      initializeWithMockData();
    }
    setLoading(false);
  }, []);

  function initializeWithMockData() {
    setProducts(mockProducts);
    
    // Extract unique categories
    const uniqueCategories = [...new Set(mockProducts.map(p => p.category))];
    setCategories(uniqueCategories);
    
    // Store in localStorage
    localStorage.setItem('products', JSON.stringify(mockProducts));
  }

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, loading]);

  // Add a new product (for sellers)
  function addProduct(productData) {
    setProducts(prevProducts => {
      const newProduct = {
        ...productData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        rating: 0,
        reviews: []
      };
      
      // Update categories if needed
      if (!categories.includes(newProduct.category)) {
        setCategories(prev => [...prev, newProduct.category]);
      }
      
      toast.success(`Added new product: ${newProduct.name}`);
      return [...prevProducts, newProduct];
    });
  }

  // Update a product (for sellers)
  function updateProduct(id, updates) {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => 
        product.id === id ? { ...product, ...updates } : product
      );
      
      // Re-calculate categories
      const uniqueCategories = [...new Set(updatedProducts.map(p => p.category))];
      setCategories(uniqueCategories);
      
      toast.success(`Updated product successfully`);
      return updatedProducts;
    });
  }

  // Delete a product (for sellers)
  function deleteProduct(id) {
    setProducts(prevProducts => {
      const filtered = prevProducts.filter(product => product.id !== id);
      
      // Re-calculate categories
      const uniqueCategories = [...new Set(filtered.map(p => p.category))];
      setCategories(uniqueCategories);
      
      toast.info(`Product removed successfully`);
      return filtered;
    });
  }

  // Add a review to a product
  function addReview(productId, reviewData) {
    setProducts(prevProducts => {
      return prevProducts.map(product => {
        if (product.id === productId) {
          const newReview = {
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            ...reviewData
          };
          
          // Add review and recalculate average rating
          const updatedReviews = [...product.reviews, newReview];
          const totalRating = updatedReviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / updatedReviews.length;
          
          toast.success(`Your review has been added`);
          
          return {
            ...product,
            reviews: updatedReviews,
            rating: parseFloat(averageRating.toFixed(1))
          };
        }
        return product;
      });
    });
  }

  // Filter products by category
  function getProductsByCategory(category) {
    if (!category || category === 'all') {
      return products;
    }
    return products.filter(product => product.category === category);
  }

  // Search products
  function searchProducts(query) {
    if (!query) {
      return products;
    }
    
    const searchTerm = query.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm) || 
      product.description.toLowerCase().includes(searchTerm)
    );
  }

  // Get products by seller ID
  function getProductsBySeller(sellerId) {
    return products.filter(product => product.sellerId === sellerId);
  }

  // Get a single product by ID
  function getProductById(id) {
    return products.find(product => product.id === id) || null;
  }

  const value = {
    products,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addReview,
    getProductsByCategory,
    searchProducts,
    getProductsBySeller,
    getProductById
  };

  return (
    <ProductContext.Provider value={value}>
      {!loading && children}
    </ProductContext.Provider>
  );
}
