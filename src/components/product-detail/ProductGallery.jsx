
import { useState } from 'react';

const ProductGallery = ({ images, productName }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div>
      {/* Main image */}
      <div className="bg-gray-100 rounded-lg h-96 mb-4 overflow-hidden">
        <img 
          src={images[activeImageIndex]} 
          alt={productName} 
          className="w-full h-full object-contain"
        />
      </div>
      
      {/* Thumbnails */}
      <div className="flex space-x-4">
        {images.map((image, index) => (
          <div 
            key={index}
            onClick={() => setActiveImageIndex(index)}
            className={`border rounded cursor-pointer h-24 w-24 p-2 ${
              activeImageIndex === index ? 'border-exclusive-red' : 'border-gray-200'
            }`}
          >
            <img src={image} alt={`${productName} thumbnail ${index}`} className="w-full h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
