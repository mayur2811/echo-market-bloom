
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

// Import the new components
import Breadcrumb from '../components/product-detail/Breadcrumb';
import ProductGallery from '../components/product-detail/ProductGallery';
import ProductInfo from '../components/product-detail/ProductInfo';
import ProductTabs from '../components/product-detail/ProductTabs';
import RelatedProducts from '../components/product-detail/RelatedProducts';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, products, addReview } = useProducts();
  const { addToCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Fetch product
  useEffect(() => {
    const fetchProduct = () => {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        // Generate dummy image URLs for gallery
        const imageUrls = [
          foundProduct.imageUrl,
          `https://source.unsplash.com/random/300x300/?${foundProduct.category.toLowerCase()}-1`,
          `https://source.unsplash.com/random/300x300/?${foundProduct.category.toLowerCase()}-2`,
          `https://source.unsplash.com/random/300x300/?${foundProduct.category.toLowerCase()}-3`,
        ];
        
        setProduct({
          ...foundProduct,
          imageGallery: imageUrls
        });
        
        // Find related products from same category - making sure products exists first
        if (products && Array.isArray(products)) {
          const related = products
            .filter(p => p.category === foundProduct.category && p.id !== id)
            .slice(0, 4);
          
          setRelatedProducts(related);
        } else {
          setRelatedProducts([]);
        }
      } else {
        // Product not found, redirect to products
        navigate('/products');
        toast.error('Product not found');
      }
    };
    
    fetchProduct();
  }, [id, getProductById, navigate, products]);
  
  // Modified cart handler to accept size and color
  const handleAddToCart = (product, quantity, size, color) => {
    if (!size || !color) {
      toast.error('Please select both size and color');
      return;
    }
    
    addToCart({
      ...product,
      selectedSize: size,
      selectedColor: color
    }, quantity);
    
    toast.success(`Added ${product.name} to cart`);
  };
  
  if (!product) {
    return (
      <div className="exclusive-container py-16 text-center">
        <div className="spinner"></div>
        <p className="mt-4">Loading product...</p>
      </div>
    );
  }
  
  return (
    <div className="exclusive-container py-8">
      {/* Breadcrumb */}
      <Breadcrumb productName={product.name} />
      
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Gallery */}
        <ProductGallery 
          images={product.imageGallery} 
          productName={product.name} 
        />
        
        {/* Product Info */}
        <ProductInfo 
          product={product} 
          addToCart={handleAddToCart}
        />
      </div>
      
      {/* Product tabs */}
      <ProductTabs 
        product={product}
        isAuthenticated={isAuthenticated}
        currentUser={currentUser}
        addReview={addReview}
      />
      
      {/* Related products */}
      <RelatedProducts 
        relatedProducts={relatedProducts} 
        addToCart={addToCart}
      />
    </div>
  );
};

export default ProductDetail;
