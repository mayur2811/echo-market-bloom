
import { useState } from 'react';
import { ShoppingCart, Truck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductInfo = ({ product, addToCart }) => {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  
  // Available colors and sizes
  const colors = [
    { name: 'White', value: 'white' },
    { name: 'Red', value: 'red-500' },
    { name: 'Blue', value: 'blue-500' },
    { name: 'Black', value: 'black' },
  ];
  
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];
  
  // Handle quantity change
  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Handle color selection
  const handleColorSelect = (colorValue) => {
    setSelectedColor(colorValue);
  };
  
  // Handle size selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate('/checkout');
  };
  
  return (
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
        <span className="text-gray-500">({product.reviews ? product.reviews.length : 0} Reviews)</span>
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
      
      {/* Color options */}
      <div className="mb-6">
        <span className="text-gray-700 block mb-2">Colors: {selectedColor && <span className="ml-2 text-exclusive-red">{selectedColor}</span>}</span>
        <div className="flex space-x-2">
          {colors.map(color => (
            <button 
              key={color.value}
              className={`w-8 h-8 rounded-full bg-${color.value} ${selectedColor === color.name ? 'ring-2 ring-exclusive-red ring-offset-2' : ''}`}
              onClick={() => handleColorSelect(color.name)}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>
      
      {/* Size options */}
      <div className="mb-6">
        <span className="text-gray-700 block mb-2">Size: {selectedSize && <span className="ml-2 text-exclusive-red">{selectedSize}</span>}</span>
        <div className="flex space-x-2">
          {sizes.map(size => (
            <button 
              key={size}
              className={`w-10 h-10 flex items-center justify-center border rounded transition-colors ${
                selectedSize === size 
                  ? 'bg-exclusive-red text-white' 
                  : 'hover:border-exclusive-red'
              }`}
              onClick={() => handleSizeSelect(size)}
            >
              {size}
            </button>
          ))}
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
          disabled={!selectedSize || !selectedColor}
          title={!selectedSize || !selectedColor ? "Please select size and color" : ""}
        >
          <ShoppingCart size={20} className="mr-2" />
          Add to Cart
        </button>
        
        <button 
          onClick={handleBuyNow}
          className="exclusive-btn flex items-center"
          disabled={!selectedSize || !selectedColor}
          title={!selectedSize || !selectedColor ? "Please select size and color" : ""}
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
  );
};

export default ProductInfo;
