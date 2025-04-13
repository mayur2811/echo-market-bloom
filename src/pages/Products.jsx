
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/products/ProductCard';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious,
  PaginationEllipsis
} from '@/components/ui/pagination';

const Products = () => {
  const { products, categories } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9);
  
  // Get query parameters
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');
  const sortParam = searchParams.get('sort') || 'newest';
  const pageParam = searchParams.get('page');
  
  // Filter and sorting states
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || 'all');
  const [selectedSortOption, setSelectedSortOption] = useState(sortParam);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 2000 });
  
  // Set initial page from URL params
  useEffect(() => {
    if (pageParam) {
      setCurrentPage(parseInt(pageParam));
    }
  }, [pageParam]);
  
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
    if (currentPage > 1) {
      params.set('page', currentPage.toString());
    }
    
    setSearchParams(params);
  }, [selectedCategory, searchParam, selectedSortOption, currentPage, setSearchParams]);
  
  // Handle filter changes
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page on category change
  };
  
  const handleSortChange = (e) => {
    setSelectedSortOption(e.target.value);
    setCurrentPage(1); // Reset to first page on sort change
  };
  
  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({
      ...prev,
      [type]: Number(value)
    }));
    setCurrentPage(1); // Reset to first page on price change
  };
  
  const toggleFilterMenu = () => {
    setFilterMenuOpen(!filterMenuOpen);
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  // Page change handler
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0); // Scroll to top on page change
  };
  
  // Generate pagination items
  const renderPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={currentPage === 1} 
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is > 3
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={currentPage === i} 
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is < totalPages - 2
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink 
              isActive={currentPage === totalPages} 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    
    return items;
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
              Showing {currentProducts.length} of {filteredProducts.length} results
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
          {currentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {currentProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-500">No products found matching your criteria.</p>
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)} 
                      />
                    </PaginationItem>
                  )}
                  
                  {renderPaginationItems()}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)} 
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
