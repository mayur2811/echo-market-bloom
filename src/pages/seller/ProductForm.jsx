
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../context/ProductContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addProduct, updateProduct, getProductById, categories: allCategories } = useProducts();
  const { currentUser } = useAuth();
  
  const isEditing = !!id;
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    imageUrl: '',
    stock: '',
    specifications: {
      brand: '',
      model: '',
      color: '',
      weight: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  
  // Load product data if editing
  useEffect(() => {
    if (isEditing) {
      const product = getProductById(id);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          discountPrice: product.discountPrice.toString(),
          category: product.category,
          imageUrl: product.imageUrl,
          stock: product.stock.toString(),
          specifications: {
            ...product.specifications
          }
        });
      } else {
        // Product not found, redirect
        toast.error('Product not found');
        navigate('/seller/dashboard/products');
      }
    }
  }, [isEditing, id, getProductById, navigate]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle specification changes
  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [name]: value
      }
    }));
  };
  
  // Handle custom category addition
  const handleAddCustomCategory = () => {
    if (customCategory.trim()) {
      setFormData(prev => ({
        ...prev,
        category: customCategory.trim()
      }));
      setCustomCategory('');
      toast.success(`Added new category: ${customCategory}`);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: parseFloat(formData.discountPrice) || parseFloat(formData.price),
        stock: parseInt(formData.stock) || 0,
        sellerId: currentUser.id
      };
      
      if (isEditing) {
        updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        addProduct(productData);
        toast.success('Product added successfully');
      }
      
      navigate('/seller/dashboard/products');
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Product name */}
            <div>
              <label className="block mb-2" htmlFor="name">
                Product Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="exclusive-input"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {/* Product category */}
            <div>
              <label className="block mb-2" htmlFor="category">
                Category*
              </label>
              <select
                id="category"
                name="category"
                className="exclusive-input"
                value={formData.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {allCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              
              {/* Add custom category */}
              <div className="mt-2 flex">
                <input
                  type="text"
                  placeholder="Or add a new category"
                  className="exclusive-input rounded-r-none"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleAddCustomCategory}
                  className="bg-exclusive-red text-white px-4 rounded-r hover:bg-exclusive-darkRed"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
          
          {/* Product description */}
          <div className="mb-6">
            <label className="block mb-2" htmlFor="description">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              className="exclusive-input"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Price */}
            <div>
              <label className="block mb-2" htmlFor="price">
                Regular Price*
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="exclusive-input pl-8"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Discount price */}
            <div>
              <label className="block mb-2" htmlFor="discountPrice">
                Sale Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2">$</span>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  className="exclusive-input pl-8"
                  min="0"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Leave empty to use regular price
              </p>
            </div>
            
            {/* Stock */}
            <div>
              <label className="block mb-2" htmlFor="stock">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                className="exclusive-input"
                min="0"
                value={formData.stock}
                onChange={handleInputChange}
              />
            </div>
          </div>
          
          {/* Product image */}
          <div className="mb-6">
            <label className="block mb-2" htmlFor="imageUrl">
              Image URL*
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              className="exclusive-input"
              value={formData.imageUrl}
              onChange={handleInputChange}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a URL for the product image
            </p>
            
            {formData.imageUrl && (
              <div className="mt-2">
                <p className="text-sm mb-1">Preview:</p>
                <img
                  src={formData.imageUrl}
                  alt="Product preview"
                  className="max-w-xs max-h-48 object-contain border rounded"
                />
              </div>
            )}
          </div>
          
          {/* Specifications */}
          <div className="mb-6">
            <h3 className="font-medium text-lg mb-2">Product Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1" htmlFor="brand">
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  className="exclusive-input"
                  value={formData.specifications.brand}
                  onChange={handleSpecChange}
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="model">
                  Model
                </label>
                <input
                  type="text"
                  id="model"
                  name="model"
                  className="exclusive-input"
                  value={formData.specifications.model}
                  onChange={handleSpecChange}
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="color">
                  Color
                </label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="exclusive-input"
                  value={formData.specifications.color}
                  onChange={handleSpecChange}
                />
              </div>
              <div>
                <label className="block mb-1" htmlFor="weight">
                  Weight
                </label>
                <input
                  type="text"
                  id="weight"
                  name="weight"
                  className="exclusive-input"
                  value={formData.specifications.weight}
                  onChange={handleSpecChange}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/seller/dashboard/products')}
              className="px-6 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="exclusive-btn"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
