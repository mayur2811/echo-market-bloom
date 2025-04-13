
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';

const ProfileForm = () => {
  const { currentUser, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    profileImage: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        address: currentUser.address || '',
        city: currentUser.city || '',
        state: currentUser.state || '',
        zipCode: currentUser.zipCode || '',
        country: currentUser.country || '',
        profileImage: currentUser.profileImage || 'https://source.unsplash.com/random/200x200/?portrait'
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Personal Information</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-exclusive-red text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Edit Profile
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Full Name</label>
            <p className="font-medium">{formData.name || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <p className="font-medium">{formData.email}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Phone</label>
            <p className="font-medium">{formData.phone || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Address</label>
            <p className="font-medium">{formData.address || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">City</label>
            <p className="font-medium">{formData.city || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">State</label>
            <p className="font-medium">{formData.state || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Zip Code</label>
            <p className="font-medium">{formData.zipCode || 'Not set'}</p>
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Country</label>
            <p className="font-medium">{formData.country || 'Not set'}</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-600 text-sm mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="exclusive-input w-full"
                disabled // Email usually can't be changed
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
            <div>
              <label className="block text-gray-600 text-sm mb-1">Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="exclusive-input w-full"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
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
  );
};

export default ProfileForm;
