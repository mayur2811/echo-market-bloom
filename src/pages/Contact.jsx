
import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div className="py-10">
      <div className="exclusive-container">
        <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
        
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Phone className="text-exclusive-red" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-gray-600 mb-1">+1 (555) 123-4567</p>
                <p className="text-gray-600">+1 (555) 987-6543</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Mail className="text-exclusive-red" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-gray-600 mb-1">support@exclusive.com</p>
                <p className="text-gray-600">info@exclusive.com</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-start">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <MapPin className="text-exclusive-red" size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Visit Us</h3>
                <p className="text-gray-600">123 Commerce St.</p>
                <p className="text-gray-600">New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-xl font-semibold mb-6">Send Us A Message</h2>
            
            {submitSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="exclusive-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="exclusive-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (Optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="exclusive-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="exclusive-input"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>
              
              <button
                type="submit"
                className="exclusive-btn flex items-center"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : (
                  <>
                    Send Message <Send size={16} className="ml-2" />
                  </>
                )}
              </button>
            </form>
          </div>
          
          <div>
            <div className="h-full w-full bg-gray-200 rounded-lg overflow-hidden">
              <iframe
                title="Exclusive Store Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.0059418846361!3d40.74076904379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1587032356465!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '400px' }}
                allowFullScreen=""
                loading="lazy"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-10 bg-gray-50 p-6 rounded-lg">
          <h3 className="font-semibold mb-3 flex items-center">
            <Clock size={18} className="mr-2" /> Business Hours
          </h3>
          <ul className="space-y-2">
            <li className="flex justify-between">
              <span className="text-gray-600">Monday - Friday</span>
              <span>9:00 AM - 8:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Saturday</span>
              <span>10:00 AM - 6:00 PM</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-600">Sunday</span>
              <span>Closed</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Contact;
