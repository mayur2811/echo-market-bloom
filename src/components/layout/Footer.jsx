
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-exclusive-black text-white pt-12 pb-6">
      <div className="exclusive-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Logo and info */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4">Exclusive</h3>
            <div className="mb-4">
              <p className="mb-3">Subscribe</p>
              <p className="mb-3">Get 10% off your first order</p>
            </div>
            <div className="flex items-center border border-white rounded-md overflow-hidden">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-transparent px-3 py-2 outline-none flex-grow text-white"
              />
              <button type="submit" className="px-3 py-2 hover:text-exclusive-red transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>

          {/* Column 2: Support */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Support</h4>
            <div className="space-y-2">
              <p>111 Bijoy sarani, Dhaka,</p>
              <p>DH 1515, Bangladesh.</p>
              <p>exclusive@gmail.com</p>
              <p>+88015-88888-9999</p>
            </div>
          </div>

          {/* Column 3: Account */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Account</h4>
            <ul className="space-y-2">
              <li><Link to="/account" className="hover:text-exclusive-red transition-colors">My Account</Link></li>
              <li><Link to="/login" className="hover:text-exclusive-red transition-colors">Login / Register</Link></li>
              <li><Link to="/cart" className="hover:text-exclusive-red transition-colors">Cart</Link></li>
              <li><Link to="/wishlist" className="hover:text-exclusive-red transition-colors">Wishlist</Link></li>
              <li><Link to="/products" className="hover:text-exclusive-red transition-colors">Shop</Link></li>
            </ul>
          </div>

          {/* Column 4: Quick Link */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Quick Link</h4>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="hover:text-exclusive-red transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-exclusive-red transition-colors">Terms Of Use</Link></li>
              <li><Link to="/faq" className="hover:text-exclusive-red transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-exclusive-red transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Column 5: Download App */}
          <div className="col-span-1">
            <h4 className="text-lg font-medium mb-4">Download App</h4>
            <p className="text-sm text-gray-400 mb-2">Save $3 with App New User Only</p>
            <div className="flex space-x-2 mb-4">
              <div className="bg-white p-2 rounded-lg w-24 h-24 flex items-center justify-center">
                <span className="text-black text-sm">QR Code</span>
              </div>
              <div className="flex flex-col justify-between">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" className="h-10 object-contain" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-10 object-contain" />
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-exclusive-red transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-exclusive-red transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-exclusive-red transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-exclusive-red transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© Copyright Rimel 2022. All right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
