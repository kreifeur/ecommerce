"use client";
import { useState, useEffect } from "react";
import Navbar from "../app/components/Navbar";
import HeroSection from "../app/components/HeroSection";
import CategoryGrid from "../app/components/CategoryGrid";
import ProductGrid from "../app/components/ProductGrid";
import SpecialOffers from "../app/components/SpecialOffers";
import BrandsSection from "../app/components/BrandsSection";
import FeaturesSection from "../app/components/FeaturesSection";
import Footer from "../app/components/Footer";
import CartDropdown from "../app/components/CartDropdown";
import { BiSolidCategory, BiSolidOffer } from "react-icons/bi";
import { MdLaptop, MdHeadphones, MdKeyboard, MdMouse, MdPhoneIphone } from "react-icons/md";
import { getProducts, getFeaturedProducts } from "../lib/firestore";

// Static categories with icons
const staticCategories = [
  { name: "All Products", icon: <BiSolidCategory />},
  { name: "Laptops", icon: <MdLaptop />},
  { name: "Accessories", icon: <MdHeadphones />},
  { name: "Tablets", icon: <MdPhoneIphone /> },
  { name: "Keyboards", icon: <MdKeyboard />},
  { name: "Mice", icon: <MdMouse />}
];

const brands = ["Apple", "Dell", "HP", "Lenovo", "Sony", "Logitech", "Samsung", "Keychron", "AudioTech", "FitTrack", "ComfortWear", "PhotoPro"];

const specialOffers = [
  {
    id: 1,
    title: "Back to School Sale",
    description: "Get up to 20% off on selected laptops and accessories",
    discount: "20% OFF",
    expires: "2025-09-15"
  },
  {
    id: 2,
    title: "Free Shipping",
    description: "Free shipping on all orders over $499",
    discount: "FREE SHIPPING",
    expires: "2025-12-31"
  }
];

export default function TechStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate category counts based on actual products
  const categories = staticCategories.map(category => {
    if (category.name === "All Products") {
      return { ...category, count: products.length };
    }
    const count = products.filter(product => product.category === category.name).length;
    return { ...category, count };
  });

  // Filter products based on selected category and search query
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "All Products" || product.category === selectedCategory;
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some(tag => 
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    return matchesCategory && matchesSearch;
  });

  // Get featured products for the homepage (first 8 products or featured ones)
  const featuredProducts = products
    .filter(product => product.featured || product.isNew)
    .slice(0, 8);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        ...product, 
        quantity: 1,
        image: product.images?.[0] || product.image
      }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => 
      prev.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18ABC6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading TechStore...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center flex-col max-w-screen min-h-screen">
      <div className="w-[90%] flex flex-col items-center">
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          cartItems={cartItems}
          showCart={showCart}
          setShowCart={setShowCart}
        />

        <HeroSection />
        
        <CategoryGrid
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        <ProductGrid
          products={filteredProducts.slice(0, 8)} // Show first 8 filtered products
          selectedCategory={selectedCategory}
          onAddToCart={addToCart}
          title={selectedCategory === "All Products" ? "Featured Products" : `${selectedCategory}`}
        />
        
        <SpecialOffers offers={specialOffers} />
        
        <BrandsSection brands={brands} />
        
        <FeaturesSection />
        
        {/* Cart Dropdown positioned near root */}
        <CartDropdown
          cartItems={cartItems}
          cartTotal={cartTotal}
          showCart={showCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>
      <Footer />
    </div>
  );
}