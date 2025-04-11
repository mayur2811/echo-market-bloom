
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Minus, Plus, ShoppingCart, Heart, ArrowLeft, ArrowRight, Star, Truck, RotateCcw, Check } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, addReview } = useProducts();
  const { addToCart } = useCart();
  const { currentUser, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [relatedProducts, setRelatedProducts] = useState([]);
  
  // Fetch product
  useEffect(() => {
    const fetchProduct = () => {
      const foundProduct = getProductById(id);
      if (foundProduct) {
        setProduct(foundProduct);
        
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
        
        // Find related products from same category
        const related = getProductById('all')
          .filter(p => p.category === foundProduct.category && p.id !== id)
          .slice(0, 4);
        
        setRelatedProducts(related);
      } else {
        // Product not found, redirect to products
        navigate('/products');
        toast.error('Product not found');
      }
    };
    
    fetchProduct();
  }, [id, getProductById, navigate]);
  
  if (!product) {
    return (
      <div className="exclusive-container py-16 text-center">
        <div className="spinner"></div>
        <p className="mt-4">Loading product...</p>
      </div>
    );
  }
  
  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };
  
  // Handle review submission
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please login to submit a review');
      return;
    }
    
    if (!reviewForm.comment.trim()) {
      toast.error('Please write a review comment');
      return;
    }
    
    const newReview = {
      userId: currentUser.id,
      username: currentUser.name,
      rating: reviewForm.rating,
      comment: reviewForm.comment,
    };
    
    addReview(product.id, newReview);
    setReviewForm({ rating: 5, comment: '' });
  };
  
  return (
    <div className="exclusive-container py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex">
          <li className="flex items-center">
            <Link to="/" className="text-gray-500 hover:text-exclusive-red">Home</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
          </li>
          <li className="flex items-center">
            <Link to="/products" className="text-gray-500 hover:text-exclusive-red">Products</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
          </li>
          <li className="text-gray-900">{product.name}</li>
        </ol>
      </nav>
      
      {/* Product details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product images */}
        <div>
          {/* Main image */}
          <div className="bg-gray-100 rounded-lg h-96 mb-4 overflow-hidden">
            <img 
              src={product.imageGallery[activeImageIndex]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Thumbnails */}
          <div className="flex space-x-4">
            {product.imageGallery.map((image, index) => (
              <div 
                key={index}
                onClick={() => setActiveImageIndex(index)}
                className={`border rounded cursor-pointer h-24 w-24 p-2 ${
                  activeImageIndex === index ? 'border-exclusive-red' : 'border-gray-200'
                }`}
              >
                <img src={image} alt={`${product.name} thumbnail ${index}`} className="w-full h-full object-contain" />
              </div>
            ))}
          </div>
        </div>
        
        {/* Product info */}
        <div>
          <h1 className="text-3xl font-medium mb-4">{product.name}</h1>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className={star <= product.rating ? "text-yellow-400" : "text-gray-300"}>
                  ★
                </span>
              ))}
            </div>
            <span className="text-gray-500">({product.reviews.length} Reviews)</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-green-500 flex items-center">
              <Check size={16} className="mr-1" /> In Stock
            </span>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-semibold mr-4">${product.discountPrice.toFixed(2)}</span>
            {product.discountPrice < product.price && (
              <span className="text-gray-500 line-through">${product.price.toFixed(2)}</span>
            )}
          </div>
          
          {/* Short description */}
          <p className="text-gray-700 mb-6">{product.description}</p>
          
          <hr className="my-6" />
          
          {/* Color options (if applicable) */}
          <div className="mb-6">
            <span className="text-gray-700 block mb-2">Colors:</span>
            <div className="flex space-x-2">
              <button className="w-8 h-8 rounded-full bg-white border-2 border-exclusive-red"></button>
              <button className="w-8 h-8 rounded-full bg-red-500"></button>
              <button className="w-8 h-8 rounded-full bg-blue-500"></button>
              <button className="w-8 h-8 rounded-full bg-black"></button>
            </div>
          </div>
          
          {/* Size options (if applicable) */}
          <div className="mb-6">
            <span className="text-gray-700 block mb-2">Size:</span>
            <div className="flex space-x-2">
              <button className="w-10 h-10 flex items-center justify-center border rounded hover:border-exclusive-red transition-colors">XS</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded hover:border-exclusive-red transition-colors">S</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded bg-exclusive-red text-white">M</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded hover:border-exclusive-red transition-colors">L</button>
              <button className="w-10 h-10 flex items-center justify-center border rounded hover:border-exclusive-red transition-colors">XL</button>
            </div>
          </div>
          
          {/* Quantity and actions */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center border rounded-md overflow-hidden">
              <button 
                onClick={() => handleQuantityChange('decrement')}
                className="px-3 py-2 border-r hover:bg-gray-100"
              >
                <Minus size={20} />
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button 
                onClick={() => handleQuantityChange('increment')}
                className="px-3 py-2 border-l hover:bg-gray-100"
              >
                <Plus size={20} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="exclusive-btn-outline flex items-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            
            <button 
              onClick={handleBuyNow}
              className="exclusive-btn flex items-center"
            >
              Buy Now
            </button>
          </div>
          
          {/* Delivery and return info */}
          <div className="border rounded-lg p-4 mb-6">
            <div className="flex mb-4">
              <div className="mr-4">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-medium">Free Delivery</h3>
                <p className="text-sm text-gray-500">Enter your postal code for delivery availability</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4">
                <RotateCcw size={24} />
              </div>
              <div>
                <h3 className="font-medium">Return Delivery</h3>
                <p className="text-sm text-gray-500">Free 30 Days Delivery Returns. Details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product tabs */}
      <div className="mb-12">
        <div className="flex border-b mb-6">
          <button 
            onClick={() => setActiveTab('description')}
            className={`py-3 px-6 border-b-2 ${
              activeTab === 'description' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
            }`}
          >
            Description
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-6 border-b-2 ${
              activeTab === 'specs' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
            }`}
          >
            Specifications
          </button>
          <button 
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-6 border-b-2 ${
              activeTab === 'reviews' ? 'border-exclusive-red text-exclusive-red' : 'border-transparent'
            }`}
          >
            Reviews ({product.reviews.length})
          </button>
        </div>
        
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="mb-4">
              {product.description}
            </p>
            <p className="mb-4">
              Experience the peak of performance with the {product.name}, designed for those who demand nothing but the best. 
              This product combines cutting-edge technology with elegant design to deliver an unparalleled user experience.
            </p>
            <p>
              Whether you're a professional or enthusiast, the {product.name} will exceed your expectations in every way.
            </p>
          </div>
        )}
        
        {activeTab === 'specs' && (
          <div>
            <table className="w-full border-collapse">
              <tbody>
                {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                  <tr key={key} className="border-b">
                    <th className="py-3 px-4 text-left bg-gray-50 w-1/4 capitalize">{key}</th>
                    <td className="py-3 px-4">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div>
            {/* Reviews list */}
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6 mb-8">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-200 mr-3 flex items-center justify-center">
                          {review.username ? review.username.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-medium">{review.username}</p>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className={star <= review.rating ? "text-yellow-400" : "text-gray-300"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-8">No reviews yet. Be the first to review this product!</p>
            )}
            
            {/* Review form */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Write a Review</h3>
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block mb-2">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                        className="focus:outline-none text-2xl"
                      >
                        <span className={star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}>
                          ★
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2" htmlFor="comment">Review</label>
                  <textarea
                    id="comment"
                    rows="4"
                    className="exclusive-input"
                    placeholder="Write your review here..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="exclusive-btn">
                  Submit Review
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      
      {/* Related products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium">Related Products</h2>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full border hover:border-exclusive-red hover:text-exclusive-red transition-colors">
              <ArrowLeft size={20} />
            </button>
            <button className="p-2 rounded-full border hover:border-exclusive-red hover:text-exclusive-red transition-colors">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {relatedProducts.map(relatedProduct => (
            <div key={relatedProduct.id} className="group border rounded-lg overflow-hidden">
              <div className="relative pt-[100%] bg-gray-100">
                {relatedProduct.discountPrice < relatedProduct.price && (
                  <div className="absolute top-3 left-3 bg-exclusive-red text-white text-xs px-2 py-1 rounded">
                    -
                    {Math.floor(
                      ((relatedProduct.price - relatedProduct.discountPrice) / relatedProduct.price) * 100
                    )}
                    %
                  </div>
                )}
                
                {/* Product image */}
                <img 
                  src={relatedProduct.imageUrl} 
                  alt={relatedProduct.name} 
                  className="absolute inset-0 w-full h-full object-contain p-4"
                />
                
                {/* Action buttons */}
                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <button 
                    onClick={() => addToCart(relatedProduct)}
                    className="bg-exclusive-black text-white p-2 rounded-full hover:bg-exclusive-darkGray transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingCart size={16} />
                  </button>
                  <button 
                    className="bg-exclusive-black text-white p-2 rounded-full hover:bg-exclusive-darkGray transition-colors"
                    title="Add to Wishlist"
                  >
                    <Heart size={16} />
                  </button>
                  <Link
                    to={`/products/${relatedProduct.id}`}
                    className="bg-exclusive-black text-white p-2 rounded-full hover:bg-exclusive-darkGray transition-colors"
                    title="Quick View"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-base font-medium mb-1 truncate">
                  <Link to={`/products/${relatedProduct.id}`} className="hover:text-exclusive-red transition-colors">
                    {relatedProduct.name}
                  </Link>
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-exclusive-red font-semibold">${relatedProduct.discountPrice.toFixed(2)}</span>
                  {relatedProduct.discountPrice < relatedProduct.price && (
                    <span className="text-gray-500 line-through text-sm">${relatedProduct.price.toFixed(2)}</span>
                  )}
                </div>
                
                {/* Rating */}
                <div className="flex items-center mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={star <= relatedProduct.rating ? "text-yellow-400" : "text-gray-300"}>
                      ★
                    </span>
                  ))}
                  <span className="text-xs text-gray-500 ml-2">({relatedProduct.reviews.length})</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
