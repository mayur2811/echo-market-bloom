
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { ArrowRight, ArrowLeft, ShoppingCart, Heart, Eye, Clock } from 'lucide-react';

const Home = () => {
  const { products, categories } = useProducts();
  const { addToCart } = useCart();
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [flashSaleTime, setFlashSaleTime] = useState({
    days: 3,
    hours: 23,
    minutes: 19,
    seconds: 56,
  });
  
  // Featured products for different sections
  const newArrivals = products.slice(0, 4);
  const bestSelling = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const flashSaleProducts = products.slice(0, 5).map(product => ({
    ...product,
    discountPercent: Math.floor(((product.price - product.discountPrice) / product.price) * 100)
  }));
  
  // Banners for carousel
  const banners = [
    {
      title: "Up to 10% off Voucher",
      description: "Shop our latest electronics and get special discounts.",
      image: "https://source.unsplash.com/random/800x400/?electronics",
      category: "Electronics"
    },
    {
      title: "Enhance Your Music Experience",
      description: "High-quality audio equipment for true audiophiles.",
      image: "https://source.unsplash.com/random/800x400/?headphones",
      category: "Audio"
    },
    {
      title: "Summer Fashion Collection",
      description: "Discover the latest trends for the hot season.",
      image: "https://source.unsplash.com/random/800x400/?summer-fashion",
      category: "Fashion"
    }
  ];
  
  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setFlashSaleTime(prev => {
        const newSeconds = prev.seconds - 1;
        
        if (newSeconds >= 0) {
          return { ...prev, seconds: newSeconds };
        }
        
        const newMinutes = prev.minutes - 1;
        if (newMinutes >= 0) {
          return { ...prev, minutes: newMinutes, seconds: 59 };
        }
        
        const newHours = prev.hours - 1;
        if (newHours >= 0) {
          return { ...prev, hours: newHours, minutes: 59, seconds: 59 };
        }
        
        const newDays = prev.days - 1;
        if (newDays >= 0) {
          return { ...prev, days: newDays, hours: 23, minutes: 59, seconds: 59 };
        }
        
        // Reset timer when it reaches zero
        return { days: 3, hours: 23, minutes: 19, seconds: 56 };
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Carousel navigation
  const nextBanner = () => {
    setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
  };
  
  const prevBanner = () => {
    setCurrentBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };
  
  // Auto-scroll carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      nextBanner();
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {/* Hero Banner Carousel */}
      <section className="relative bg-gray-100">
        <div className="exclusive-container py-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Categories sidebar */}
            <div className="hidden md:block w-64 border-r">
              <h3 className="text-xl font-medium mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link to={`/products?category=${category}`} className="hover:text-exclusive-red transition-colors">
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Banner */}
            <div className="flex-grow relative overflow-hidden h-[400px] rounded-lg">
              {banners.map((banner, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentBannerIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    backgroundImage: `url(${banner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center">
                    <div className="p-8 text-white max-w-lg">
                      <h2 className="text-4xl font-bold mb-4">{banner.title}</h2>
                      <p className="mb-6">{banner.description}</p>
                      <Link
                        to={`/products?category=${banner.category}`}
                        className="bg-exclusive-red text-white px-6 py-3 rounded-md hover:bg-exclusive-darkRed transition-colors"
                      >
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Navigation arrows */}
              <button 
                onClick={prevBanner}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                <ArrowLeft size={24} />
              </button>
              <button 
                onClick={nextBanner}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
              >
                <ArrowRight size={24} />
              </button>
              
              {/* Dots indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBannerIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentBannerIndex ? 'bg-exclusive-red' : 'bg-white bg-opacity-50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Flash Sale Section */}
      <section className="py-12 bg-white">
        <div className="exclusive-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-5 h-10 bg-exclusive-red mr-2"></div>
              <h2 className="text-2xl font-semibold">Flash Sales</h2>
            </div>
            
            {/* Countdown timer */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <div className="bg-exclusive-darkGray text-white px-3 py-1 rounded">
                    {String(flashSaleTime.days).padStart(2, '0')}
                  </div>
                  <span className="text-xs">Days</span>
                </div>
                <span className="text-2xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-exclusive-darkGray text-white px-3 py-1 rounded">
                    {String(flashSaleTime.hours).padStart(2, '0')}
                  </div>
                  <span className="text-xs">Hours</span>
                </div>
                <span className="text-2xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-exclusive-darkGray text-white px-3 py-1 rounded">
                    {String(flashSaleTime.minutes).padStart(2, '0')}
                  </div>
                  <span className="text-xs">Minutes</span>
                </div>
                <span className="text-2xl font-bold">:</span>
                <div className="text-center">
                  <div className="bg-exclusive-darkGray text-white px-3 py-1 rounded">
                    {String(flashSaleTime.seconds).padStart(2, '0')}
                  </div>
                  <span className="text-xs">Seconds</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Flash sale products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {flashSaleProducts.map((product) => (
              <div key={product.id} className="group border rounded-lg overflow-hidden">
                <div className="relative pt-[100%] bg-gray-100">
                  {/* Discount badge */}
                  <div className="absolute top-3 left-3 bg-exclusive-red text-white text-xs px-2 py-1 rounded">
                    -{product.discountPercent}%
                  </div>
                  
                  {/* Product image */}
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  
                  {/* Action buttons */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
                    <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
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
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="exclusive-btn inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="exclusive-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-5 h-10 bg-exclusive-red mr-2"></div>
              <h2 className="text-2xl font-semibold">Browse By Category</h2>
            </div>
            <div className="flex space-x-2">
              <button className="p-2 rounded-full border hover:border-exclusive-red hover:text-exclusive-red transition-colors">
                <ArrowLeft size={20} />
              </button>
              <button className="p-2 rounded-full border hover:border-exclusive-red hover:text-exclusive-red transition-colors">
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          {/* Category icons */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category, index) => (
              <Link
                key={index}
                to={`/products?category=${category}`}
                className="flex flex-col items-center justify-center p-8 border rounded-lg hover:border-exclusive-red hover:text-exclusive-red transition-all"
              >
                <div className="text-4xl mb-4">
                  {/* We'd use actual icons in a real app */}
                  {category.charAt(0)}
                </div>
                <span className="text-center">{category}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Best Selling Products */}
      <section className="py-12 bg-white">
        <div className="exclusive-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-5 h-10 bg-exclusive-red mr-2"></div>
              <h2 className="text-2xl font-semibold">Best Selling Products</h2>
            </div>
            <Link
              to="/products"
              className="hover:text-exclusive-red transition-colors"
            >
              View All
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSelling.map((product) => (
              <div key={product.id} className="group border rounded-lg overflow-hidden">
                <div className="relative pt-[100%] bg-gray-100">
                  {/* Product image */}
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  
                  {/* Action buttons */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
                    <span className="text-gray-500 line-through text-sm">${product.price.toFixed(2)}</span>
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
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Section - Music Experience */}
      <section className="py-12 bg-exclusive-black text-white">
        <div className="exclusive-container">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">Enhance Your Music Experience</h2>
              <p className="mb-6">Discover premium audio equipment for the perfect sound.</p>
              <div className="flex space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-exclusive-darkGray flex items-center justify-center">
                  🎧
                </div>
                <div className="w-12 h-12 rounded-full bg-exclusive-darkGray flex items-center justify-center">
                  🎵
                </div>
                <div className="w-12 h-12 rounded-full bg-exclusive-darkGray flex items-center justify-center">
                  🎹
                </div>
                <div className="w-12 h-12 rounded-full bg-exclusive-darkGray flex items-center justify-center">
                  🎚️
                </div>
              </div>
              <Link
                to="/products?category=Audio"
                className="bg-green-500 text-white px-6 py-3 inline-block rounded-md hover:bg-green-600 transition-colors"
              >
                Browse Now
              </Link>
            </div>
            <div className="md:w-1/2">
              <img 
                src="https://source.unsplash.com/random/600x400/?speaker" 
                alt="Music Experience" 
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Explore Products Section */}
      <section className="py-12 bg-white">
        <div className="exclusive-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-5 h-10 bg-exclusive-red mr-2"></div>
              <h2 className="text-2xl font-semibold">Explore Our Products</h2>
            </div>
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
            {products.slice(0, 8).map((product) => (
              <div key={product.id} className="group border rounded-lg overflow-hidden">
                <div className="relative pt-[100%] bg-gray-100">
                  {product.discountPrice < product.price && (
                    <div className="absolute top-3 left-3 bg-exclusive-red text-white text-xs px-2 py-1 rounded">
                      -
                      {Math.floor(
                        ((product.price - product.discountPrice) / product.price) * 100
                      )}
                      %
                    </div>
                  )}
                  
                  {/* Product image */}
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  
                  {/* Action buttons */}
                  <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center space-x-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
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
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <Link
              to="/products"
              className="exclusive-btn-outline inline-block"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* New Arrival Section */}
      <section className="py-12 bg-gray-50">
        <div className="exclusive-container">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div className="w-5 h-10 bg-exclusive-red mr-2"></div>
              <h2 className="text-2xl font-semibold">New Arrival</h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Featured large items */}
            <div className="col-span-1 md:col-span-2 lg:row-span-2 relative rounded-lg overflow-hidden group h-[500px]">
              <img 
                src="https://source.unsplash.com/random/800x800/?playstation" 
                alt="PlayStation 5" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">PlayStation 5</h3>
                  <p className="mb-4">Experience next-gen gaming</p>
                  <Link
                    to="/products?category=Gaming"
                    className="text-white underline"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Smaller items */}
            <div className="relative rounded-lg overflow-hidden group h-[240px]">
              <img 
                src="https://source.unsplash.com/random/400x240/?speakers" 
                alt="Speakers" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">Speakers</h3>
                  <Link
                    to="/products?category=Audio"
                    className="text-white underline text-sm"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group h-[240px]">
              <img 
                src="https://source.unsplash.com/random/400x240/?perfume" 
                alt="Perfume" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">Perfume</h3>
                  <Link
                    to="/products?category=Beauty"
                    className="text-white underline text-sm"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden group h-[240px]">
              <img 
                src="https://source.unsplash.com/random/400x240/?women-fashion" 
                alt="Women's Collections" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-white">
                  <h3 className="text-lg font-bold mb-1">Women's Collections</h3>
                  <Link
                    to="/products?category=Fashion"
                    className="text-white underline text-sm"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 bg-white border-t">
        <div className="exclusive-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg">FREE AND FAST DELIVERY</h3>
                <p className="text-sm text-gray-600">Free delivery for all orders over $140</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <Clock size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg">24/7 CUSTOMER SERVICE</h3>
                <p className="text-sm text-gray-600">Friendly 24/7 customer support</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-4 rounded-full">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h3 className="font-bold text-lg">MONEY BACK GUARANTEE</h3>
                <p className="text-sm text-gray-600">We return money within 30 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
