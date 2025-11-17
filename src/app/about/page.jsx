"use client";
import { useState } from "react";
import { FaFacebookF, FaInstagram, FaTwitter, FaStar,FaLinkedin, FaAward, FaUsers, FaRocket, FaHeart } from "react-icons/fa";
import { BiSolidQuoteLeft, BiSolidQuoteRight } from "react-icons/bi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDropdown from "../components/CartDropdown";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("mission");
  

  const teamMembers = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "/sarah.jpg",
      bio: "Tech enthusiast with over 15 years of experience in the industry. Passionate about bringing innovative technology to everyone.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    },
    {
      id: 2,
      name: "Michael Chen",
      role: "CTO",
      image: "/michael.jpg",
      bio: "Software engineer and tech innovator. Loves solving complex problems and building amazing products.",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      role: "Head of Design",
      image: "/emma.jpg",
      bio: "Creative designer with a passion for user-centered design and beautiful digital experiences.",
      social: {
        twitter: "#",
        linkedin: "#",
        dribbble: "#"
      }
    },
    {
      id: 4,
      name: "David Kim",
      role: "Marketing Director",
      image: "/david.jpg",
      bio: "Digital marketing expert who loves connecting customers with products they'll love.",
      social: {
        twitter: "#",
        linkedin: "#",
        instagram: "#"
      }
    }
  ];

  const milestones = [
    { year: "2020", event: "TechStore founded with a vision to make technology accessible" },
    { year: "2021", event: "Reached 10,000 customers and expanded product range" },
    { year: "2022", event: "Opened first physical store in New York" },
    { year: "2023", event: "Launched mobile app and reached 100,000 customers" },
    { year: "2024", event: "Expanded to European market with localized stores" },
    { year: "2025", event: "Awarded Best Tech Retailer of the Year" }
  ];

  const values = [
    {
      icon: <FaHeart className="text-3xl text-[#fd346e]" />,
      title: "Customer First",
      description: "We prioritize our customers' needs and satisfaction above all else."
    },
    {
      icon: <FaRocket className="text-3xl text-[#18ABC6]" />,
      title: "Innovation",
      description: "We constantly seek new ways to improve and stay ahead of technology trends."
    },
    {
      icon: <FaUsers className="text-3xl text-[#18ABC6]" />,
      title: "Community",
      description: "We believe in building a community around technology and learning."
    },
    {
      icon: <FaAward className="text-3xl text-[#18ABC6]" />,
      title: "Excellence",
      description: "We strive for excellence in every product we offer and every service we provide."
    }
  ];

  const stats = [
    { number: "100K+", label: "Happy Customers" },
    { number: "500+", label: "Products Available" },
    { number: "25+", label: "Brand Partners" },
    { number: "98%", label: "Customer Satisfaction" }
  ];

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems(cartItems.filter(item => item.id !== id));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  };


  return (
    <div className="flex items-center flex-col max-w-screen min-h-screen">
      <div className="w-[90%] flex flex-col items-center">
        {/* navbar */}
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartItems={cartItems}
          showCart={showCart}
          setShowCart={setShowCart}
        />

        {/* Hero Section */}
        <section className="w-full py-12 mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#1c274c] mb-4">About TechStore</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about technology and committed to bringing you the best products 
            at the most competitive prices.
          </p>
        </section>

        {/* Stats Section */}
        <section className="w-full mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-[#18ABC6] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story Section */}
        <section className="w-full mb-16">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-600 mb-4">
                  TechStore was founded in 2020 with a simple mission: to make cutting-edge technology 
                  accessible to everyone. What started as a small online store has grown into a trusted 
                  destination for tech enthusiasts and everyday users alike.
                </p>
                <p className="text-gray-600 mb-4">
                  Our journey began when our founder, Sarah Johnson, noticed that many people were 
                  overwhelmed by the rapid pace of technological change. She wanted to create a place 
                  where people could find not just products, but also guidance, support, and community.
                </p>
                <p className="text-gray-600">
                  Today, we're proud to serve over 100,000 customers across the globe, offering 
                  carefully curated products from the world's leading brands alongside exceptional 
                  customer service.
                </p>
              </div>
              <div className="bg-gray-200 rounded-2xl h-64 flex items-center justify-center">
                <span className="text-gray-500">Company Timeline Image</span>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="w-full mb-16">
          <h2 className="text-2xl font-semibold text-[#1c274c] mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6 text-center">
                <div className="flex justify-center mb-4">{value.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="w-full mb-16">
          <h2 className="text-2xl font-semibold text-[#1c274c] mb-8 text-center">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-2xl shadow-md overflow-hidden text-center">
                <div className="h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Team Member Photo</span>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-[#18ABC6] mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                  <div className="flex justify-center gap-3">
                    <button className="text-gray-400 hover:text-[#1DA1F2]">
                      <FaTwitter />
                    </button>
                    <button className="text-gray-400 hover:text-[#0077B5]">
                      <FaLinkedin />
                    </button>
                    <button className="text-gray-400 hover:text-[#E1306C]">
                      <FaInstagram />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline Section */}
        <section className="w-full mb-16">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <h2 className="text-2xl font-semibold text-[#1c274c] mb-8 text-center">Our Journey</h2>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 h-full w-1 bg-[#18ABC6] transform -translate-x-1/2"></div>
              
              {/* Timeline items */}
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={index} className={`relative flex ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center`}>
                    {/* Date circle */}
                    <div className="absolute left-4 md:left-1/2 w-8 h-8 bg-[#18ABC6] rounded-full border-4 border-white transform -translate-x-1/2 z-10"></div>
                    
                    {/* Content */}
                    <div className={`ml-16 md:ml-0 md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'}`}>
                      <div className={`${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                        <div className="text-2xl font-bold text-[#18ABC6]">{milestone.year}</div>
                        <p className="text-gray-600">{milestone.event}</p>
                      </div>
                    </div>
                    
                    {/* Spacer for opposite side */}
                    <div className="md:w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full mb-16">
          <h2 className="text-2xl font-semibold text-[#1c274c] mb-8 text-center">What Our Customers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold">Customer Name</h4>
                    <p className="text-gray-500 text-sm">Verified Buyer</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 mb-3">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                </div>
                <BiSolidQuoteLeft className="text-[#18ABC6] text-xl mb-2" />
                <p className="text-gray-600 italic">
                  TechStore has the best customer service I've ever experienced. They helped me choose 
                  the perfect laptop for my needs and followed up to make sure I was happy with my purchase.
                </p>
                <BiSolidQuoteRight className="text-[#18ABC6] text-xl ml-auto mt-2" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full mb-16 bg-gradient-to-r from-[#18ABC6] to-[#0f7a94] rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-semibold mb-4">Join the TechStore Family</h2>
          <p className="mb-6 max-w-2xl mx-auto">
            Experience the difference that comes with shopping at a store that truly cares about 
            your technology needs and satisfaction.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 bg-white text-[#18ABC6] py-3 rounded-lg font-[500] shadow">
              Shop Now
            </button>
            <button className="px-6 bg-transparent border border-white text-white py-3 rounded-lg font-[500]">
              Contact Us
            </button>
          </div>

          <CartDropdown
          cartItems={cartItems}
          cartTotal={cartTotal}
          showCart={showCart}
          updateQuantity={updateQuantity}
        />
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}