
import { useState } from 'react';
import ProductDescription from './ProductDescription';
import ProductSpecifications from './ProductSpecifications';
import ProductReviews from './ProductReviews';

const ProductTabs = ({ product, isAuthenticated, currentUser, addReview }) => {
  const [activeTab, setActiveTab] = useState('description');
  
  return (
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
          Reviews ({product.reviews ? product.reviews.length : 0})
        </button>
      </div>
      
      {activeTab === 'description' && <ProductDescription product={product} />}
      {activeTab === 'specs' && <ProductSpecifications specifications={product.specifications} />}
      {activeTab === 'reviews' && (
        <ProductReviews 
          product={product} 
          isAuthenticated={isAuthenticated}
          currentUser={currentUser}
          addReview={addReview}
        />
      )}
    </div>
  );
};

export default ProductTabs;
