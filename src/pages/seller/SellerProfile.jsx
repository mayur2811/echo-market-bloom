
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Building, Globe, Camera } from 'lucide-react';
import { toast } from 'sonner';

const SellerProfile = () => {
  const { currentUser, isSeller } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    website: '',
    bio: '',
    profileImage: 'https://source.unsplash.com/random/200x200/?portrait'
  });

  const [isEditing, setIsEditing] = useState(false);

  // Populate form with current user data
  useEffect(() => {
    if (currentUser) {
      setProfileData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        company: currentUser.company || 'Your Company Name',
        website: currentUser.website || '',
        bio: currentUser.bio || 'Tell customers about your business and products.',
        profileImage: currentUser.profileImage || 'https://source.unsplash.com/random/200x200/?portrait'
      });
    }
  }, [currentUser]);

  // Check if user is a seller
  useEffect(() => {
    if (!isSeller) {
      toast.error("Access denied: Seller account required");
      navigate('/login');
    }
  }, [isSeller, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // In a real app, this would be an API call to update the profile
    // For now, we'll just simulate a successful update
    setTimeout(() => {
      toast.success("Profile updated successfully");
      setIsEditing(false);
    }, 800);
  };

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Seller Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-exclusive-red text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-exclusive-red to-red-500 h-32"></div>
        
        <div className="px-6 py-4 sm:px-8 pb-8">
          <div className="flex flex-col sm:flex-row -mt-16 mb-6 items-end sm:items-center gap-4">
            <div className="relative">
              <img
                src={profileData.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 rounded-full bg-exclusive-red p-1 text-white" title="Change profile picture">
                  <Camera size={16} />
                </button>
              )}
            </div>
            
            {!isEditing ? (
              <div className="ml-0 sm:ml-4">
                <h2 className="text-xl font-bold">{profileData.name}</h2>
                <p className="text-gray-600">{profileData.company}</p>
              </div>
            ) : (
              <div className="ml-0 sm:ml-4">
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red mb-1 px-3 py-1 border"
                  placeholder="Your Name"
                />
                <input
                  type="text"
                  name="company"
                  value={profileData.company}
                  onChange={handleChange}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-1 border"
                  placeholder="Company Name"
                />
              </div>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-600">{profileData.bio}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Mail className="text-gray-500 mr-2" size={18} />
                    <span>{profileData.email}</span>
                  </div>
                  
                  {profileData.phone && (
                    <div className="flex items-center">
                      <Phone className="text-gray-500 mr-2" size={18} />
                      <span>{profileData.phone}</span>
                    </div>
                  )}
                  
                  {profileData.address && (
                    <div className="flex items-center">
                      <MapPin className="text-gray-500 mr-2" size={18} />
                      <span>{profileData.address}</span>
                    </div>
                  )}
                  
                  {profileData.company && (
                    <div className="flex items-center">
                      <Building className="text-gray-500 mr-2" size={18} />
                      <span>{profileData.company}</span>
                    </div>
                  )}
                  
                  {profileData.website && (
                    <div className="flex items-center">
                      <Globe className="text-gray-500 mr-2" size={18} />
                      <a href={profileData.website} className="text-exclusive-red hover:underline" target="_blank" rel="noopener noreferrer">
                        {profileData.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About
                </label>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-2 border"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Mail className="text-gray-500" size={16} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-2 border"
                      placeholder="Email Address"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Phone className="text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-2 border"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <MapPin className="text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-2 border"
                      placeholder="Address"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <Globe className="text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      name="website"
                      value={profileData.website}
                      onChange={handleChange}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:border-exclusive-red focus:ring-exclusive-red px-3 py-2 border"
                      placeholder="Website"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-exclusive-red text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfile;
