
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye, ArrowLeft, ArrowRight } from 'lucide-react';

const RelatedProducts = ({ relatedProducts, addToCart }) => {
  return (
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
        {relatedProducts && relatedProducts.length > 0 ? (
          relatedProducts.map(relatedProduct => (
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
                  <span className="text-xs text-gray-500 ml-2">({relatedProduct.reviews ? relatedProduct.reviews.length : 0})</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-8 text-gray-500">
            No related products found
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
