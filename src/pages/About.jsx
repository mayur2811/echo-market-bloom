
import React from 'react';

const About = () => {
  return (
    <div className="py-10">
      <div className="exclusive-container">
        <h1 className="text-3xl font-bold mb-8">About Exclusive</h1>
        
        <div className="grid md:grid-cols-2 gap-12 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2023, Exclusive started with a simple mission: to create a seamless shopping experience 
              that brings quality products to customers worldwide. What began as a small online store has grown 
              into a marketplace connecting buyers and sellers across the globe.
            </p>
            <p className="text-gray-700">
              Our team is passionate about curating collections that blend quality, innovation, and value. 
              We believe in empowering both shoppers and sellers, creating a community where great products 
              find their perfect homes.
            </p>
          </div>
          
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src="https://source.unsplash.com/random/800x600/?team" 
              alt="Our Team" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Quality First</h3>
              <p className="text-gray-600">
                We believe in offering only the best products that meet our rigorous quality standards.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Customer Focused</h3>
              <p className="text-gray-600">
                Every decision we make puts our customers' needs and satisfaction at the center.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-medium mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously seek to improve and innovate in our product offerings and services.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
          <p className="text-gray-700 mb-6">
            Whether you're a buyer looking for quality products or a seller seeking to reach new customers, 
            Exclusive offers a platform where you can connect, discover, and grow.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="exclusive-btn">Shop Now</button>
            <button className="exclusive-btn-outline">Become a Seller</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
