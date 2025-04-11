
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';

const Products = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Get query parameters
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const sortParam = searchParams.get('sort') || 'newest';
  
  // Filter and sorting states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedSortOption, setSelectedSortOption] = useState(sortParam);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  
  // Apply filters and sorting
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by category
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by search term
    if (searchParam) {
      const searchLower = searchParam.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchLower) || 
        product.description.toLowerCase().includes(searchLower)
      );
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.discountPrice >= priceRange.min && product.discountPrice <= priceRange.max
    );
    
    // Apply sorting
    switch (selectedSortOption) {
      case 'newest':
        // Assuming products have a createdAt field
        filtered.sort((a, b) => new Date(b.createdAt || '') - new Date(a.createdAt || ''));
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.discountPrice - b.discountPrice);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.discountPrice - a.discountPrice);
        break;
      case 'popular':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    
    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchParam, selectedSortOption, priceRange]);
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    if (searchParam) {
      params.set('search', searchParam);
    }
    if (selectedSortOption) {
      params.set('sort', selectedSortOption);
    }
    
    setSearchParams(params);
  }, [selectedCategory, searchParam, selectedSortOption, setSearchParams]);
  
  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };
  
  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
  };
  
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(value)
    }));
  };
  
  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };
  
  return (
    <div className="exclusive-container py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <a href="/" className="text-gray-500 hover:text-exclusive-red">
                Home
              </a>
            </li>
            <li className="flex items-center">
              <span className="mx-2 text-gray-500">/</span>
              <span className="text-gray-900">Products</span>
            </li>
            {categoryParam && (
              <li className="flex items-center">
                <span className="mx-2 text-gray-500">/</span>
                <span className="text-gray-900">{categoryParam}</span>
              </li>
            )}
          </ol>
        </nav>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={toggleFilterMenu}
            className="flex items-center justify-between w-full border rounded-md px-4 py-2"
          >
            <div className="flex items-center">
              <Filter size={18} className="mr-2" />
              <span>Filters</span>
            </div>
            {filterMenuOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
        
        {/* Filters sidebar */}
        <div className={`md:w-64 ${filterMenuOpen ? 'block' : 'hidden md:block'}`}>
          <div className="border rounded-lg p-4 bg-white">
            {/* Categories filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Categories</h3>
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`flex items-center w-full text-left ${selectedCategory === 'all' ? 'text-exclusive-red' : 'text-gray-700'}`}
                  >
                    All Categories
                  </button>
                </li>
                {categories.map((category, index) => (
                  <li key={index}>
                    <button
                      onClick={() => handleCategoryChange(category)}
                      className={`flex items-center w-full text-left ${selectedCategory === category ? 'text-exclusive-red' : 'text-gray-700'}`}
                    >
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Price range filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Price Range</h3>
              <div className="space-y-4">
                <div>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="10"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    className="exclusive-input"
                    placeholder="Min"
                    min="0"
                    value={priceRange.min}
                    onChange={(e) => handlePriceChange('min', e.target.value)}
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    className="exclusive-input"
                    placeholder="Max"
                    min="0"
                    value={priceRange.max}
                    onChange={(e) => handlePriceChange('max', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products grid */}
        <div className="flex-grow">
          {/* Sort and results info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <p className="text-gray-500">
              Showing {filteredProducts.length} results
            </p>
            <div className="flex items-center">
              <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
              <select
                id="sort"
                className="border rounded px-3 py-1.5"
                value={selectedSortOption}
                onChange={handleSortChange}
              >
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>
          
          {/* Products grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
          
          {/* Pagination (simplified for demo) */}
          <div className="mt-8 flex justify-center">
            <nav>
              <ul className="flex space-x-2">
                <li>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">
                    &laquo;
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 border rounded bg-exclusive-red text-white">
                    1
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">
                    2
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">
                    3
                  </button>
                </li>
                <li>
                  <button className="px-3 py-1 border rounded hover:bg-gray-50">
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
