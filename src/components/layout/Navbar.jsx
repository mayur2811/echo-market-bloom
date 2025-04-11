
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, Package, BarChart2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, currentUser, logout, isSeller } = useAuth();
  const { cartCount } = useCart();

  const handleSearch = (e) => {
    e.preventDefault();
    // Will be implemented with search functionality
    console.log('Searching for:', searchTerm);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="w-full bg-white border-b">
      {/* Top announcement bar */}
      <div className="bg-exclusive-black text-white text-center py-2 px-4 text-sm">
        Summer Sale For All Swim Suits And Free Express Delivery - OFF 50%! <span className="font-bold ml-1 cursor-pointer hover:underline">ShopNow</span>
      </div>
      
      {/* Main navbar */}
      <div className="exclusive-container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold">
            Exclusive
          </Link>
          
          {/* Mobile menu toggle */}
          <button 
            className="md:hidden flex items-center text-gray-700"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-exclusive-red">Home</Link>
            <Link to="/products" className="hover:text-exclusive-red">Products</Link>
            <Link to="/about" className="hover:text-exclusive-red">About</Link>
            <Link to="/contact" className="hover:text-exclusive-red">Contact</Link>
            {isAuthenticated && isSeller && (
              <Link to="/seller/dashboard" className="hover:text-exclusive-red">Dashboard</Link>
            )}
          </nav>
          
          {/* Search bar */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-md overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center">
              <input
                type="text"
                placeholder="What are you looking for?"
                className="px-3 py-2 outline-none bg-gray-100 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="px-3 py-2">
                <Search size={20} />
              </button>
            </form>
          </div>
          
          {/* Action icons */}
          <div className="flex items-center space-x-4">
            <Link to="/wishlist" className="hover:text-exclusive-red">
              <Heart size={24} />
            </Link>
            <Link to="/cart" className="hover:text-exclusive-red relative">
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-exclusive-red text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="relative group">
                <button className="hover:text-exclusive-red flex items-center space-x-1">
                  <User size={24} />
                  {currentUser && (
                    <span className="hidden md:block text-sm">{currentUser.name}</span>
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-20 hidden group-hover:block">
                  <div className="py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <User size={16} className="mr-2" />
                        <span>My Profile</span>
                      </div>
                    </Link>
                    {isSeller && (
                      <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <div className="flex items-center">
                          <BarChart2 size={16} className="mr-2" />
                          <span>Seller Dashboard</span>
                        </div>
                      </Link>
                    )}
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <div className="flex items-center">
                        <Package size={16} className="mr-2" />
                        <span>My Orders</span>
                      </div>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hover:text-exclusive-red">
                <User size={24} />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white absolute z-40 w-full shadow-lg py-4 animate-fade-in">
          <div className="exclusive-container">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="flex items-center bg-gray-100 rounded-md overflow-hidden">
                <input
                  type="text"
                  placeholder="What are you looking for?"
                  className="px-3 py-2 outline-none bg-gray-100 flex-grow"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className="px-3 py-2">
                  <Search size={20} />
                </button>
              </div>
            </form>
            
            {/* Mobile nav links */}
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
              <Link to="/products" className="hover:text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>Products</Link>
              <Link to="/about" className="hover:text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
              <Link to="/contact" className="hover:text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
              {isAuthenticated && isSeller && (
                <Link to="/seller/dashboard" className="hover:text-exclusive-red font-semibold text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>
                  <div className="flex items-center">
                    <BarChart2 size={16} className="mr-2" />
                    <span>Seller Dashboard</span>
                  </div>
                </Link>
              )}
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="hover:text-exclusive-red flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <User size={16} className="mr-2" />
                    <span>My Profile</span>
                  </Link>
                  <Link to="/profile" className="hover:text-exclusive-red flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <Package size={16} className="mr-2" />
                    <span>My Orders</span>
                  </Link>
                  <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} 
                    className="text-left hover:text-exclusive-red flex items-center"
                  >
                    <LogOut size={16} className="mr-2" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="hover:text-exclusive-red" onClick={() => setIsMobileMenuOpen(false)}>Login / Register</Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
