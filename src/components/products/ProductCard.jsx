
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  
  const discountPercent = product.discountPrice < product.price
    ? Math.floor(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div 
      className="group border rounded-lg overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[100%] bg-gray-100">
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-exclusive-red text-white text-xs px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
        
        {/* Product image */}
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-contain p-4"
        />
        
        {/* Action buttons */}
        <div 
          className={`absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 transition-all duration-300 ${
            isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
          }`}
        >
          <button 
            onClick={() => addToCart(product)}
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
            to={`/products/${product.id}`}
            className="bg-exclusive-black text-white p-2 rounded-full hover:bg-exclusive-darkGray transition-colors"
            title="Quick View"
          >
            <Eye size={16} />
          </Link>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-medium mb-1 truncate">
          <Link to={`/products/${product.id}`} className="hover:text-exclusive-red transition-colors">
            {product.name}
          </Link>
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-exclusive-red font-semibold">${product.discountPrice.toFixed(2)}</span>
          {product.discountPrice < product.price && (
            <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
          )}
        </div>
        
        {/* Rating */}
        <div className="flex items-center mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={star <= product.rating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews.length})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
