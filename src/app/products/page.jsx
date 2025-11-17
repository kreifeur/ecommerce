"use client";
import { useState, useEffect } from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaSearch,
  FaShoppingCart,
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaFilter,
  FaTimes,
} from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import {
  MdLaptop,
  MdHeadphones,
  MdKeyboard,
  MdMouse,
  MdPhoneIphone,
} from "react-icons/md";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CartDropdown from "../components/CartDropdown";
import { getProducts } from "../../lib/firestore";
import Link from "next/link";





const brands = [
  "Apple",
  "Dell",
  "HP",
  "ASUS",
  "Sony",
  "Logitech",
  "Samsung",
  "Keychron",
  "Razer",
  "AudioTech",
  "FitTrack",
  "ComfortWear",
  "PhotoPro",
  "RunFast",
  "HomeEssentials"
];

const priceRanges = [
  { label: "Under $100", min: 0, max: 100 },
  { label: "$100 - $500", min: 100, max: 500 },
  { label: "$500 - $1000", min: 500, max: 1000 },
  { label: "Over $1000", min: 1000, max: 10000 },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All Products");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("featured");

  const categories = [
  { name: "All Products", icon: <BiSolidCategory />, count: products.length },
  {
    name: "Laptops",
    icon: <MdLaptop />,
    count: products.filter((p) => p.category === "Laptops").length,
  },
  {
    name: "Headphones",
    icon: <MdHeadphones />,
    count: products.filter((p) => p.category === "Headphones").length,
  },
  {
    name: "Keyboards",
    icon: <MdKeyboard />,
    count: products.filter((p) => p.category === "Keyboards").length,
  },
  {
    name: "Mice",
    icon: <MdMouse />,
    count: products.filter((p) => p.category === "Mice").length,
  },
  {
    name: "Tablets",
    icon: <MdPhoneIphone />,
    count: products.filter((p) => p.category === "Tablets").length,
  },
  {
    name: "Storage",
    icon: <BiSolidCategory />,
    count: products.filter((p) => p.category === "Storage").length,
  },
];

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

  // Update category counts when products change
  useEffect(() => {
    const updatedCategories = categories.map(category => {
      if (category.name === "All Products") {
        return { ...category, count: products.length };
      }
      const count = products.filter(product => product.category === category.name).length;
      return { ...category, count };
    });
    
    // Update the categories array (you might want to set this to state if you need reactive updates)
    categories.forEach((cat, index) => {
      categories[index].count = updatedCategories[index].count;
    });
  }, [products]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "All Products" ||
      product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    const matchesBrand =
      selectedBrands.length === 0 || 
      (product.brand && selectedBrands.includes(product.brand));
    const matchesPrice =
      product.price >= priceRange.min && product.price <= priceRange.max;

    return matchesCategory && matchesSearch && matchesBrand && matchesPrice;
  });

  // Sort products based on selection
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return (b.rating || 0) - (a.rating || 0);
      case "newest":
        // Assuming newer products have later createdAt dates
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      default:
        // Featured - you might want to sort by featured status
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    }
  });

  const addToCart = (product) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const toggleBrand = (brand) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-sm" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400 text-sm" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-sm" />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating || 0})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18ABC6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

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

        {/* Page Header */}
        <section className="w-full py-8 mb-8">
          <h1 className="text-3xl font-bold text-[#1c274c] mb-2">
            Our Products
          </h1>
          <p className="text-gray-600">
            Discover the latest products at competitive prices
          </p>
        </section>

        <div className="w-full flex sm:flex-row flex-col gap-8 mb-12">
          {/* Filters Sidebar */}
          <div className="sm:w-1/4 w-full">
            <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="sm:hidden flex items-center gap-1 text-[#18ABC6]"
                >
                  {showFilters ? <FaTimes /> : <FaFilter />}
                  {showFilters ? "Close" : "Filters"}
                </button>
              </div>

              <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories.map((category) => (
                      <div
                        key={category.name}
                        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                          selectedCategory === category.name
                            ? "bg-[#18ABC6] bg-opacity-10"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[#18ABC6]">
                            {category.icon}
                          </span>
                          <span className="text-sm">{category.name}</span>
                        </div>
                        <span className="text-gray-500 text-xs">
                          {category.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="space-y-2">
                    {priceRanges.map((range) => (
                      <div
                        key={range.label}
                        className={`flex items-center p-2 rounded-lg cursor-pointer ${
                          priceRange.min === range.min &&
                          priceRange.max === range.max
                            ? "bg-[#18ABC6] bg-opacity-10"
                            : "hover:bg-gray-100"
                        }`}
                        onClick={() =>
                          setPriceRange({ min: range.min, max: range.max })
                        }
                      >
                        <span className="text-sm">{range.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brands */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Brands</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {brands.map((brand) => (
                      <div
                        key={brand}
                        className="flex items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => toggleBrand(brand)}
                      >
                        <input
                          type="checkbox"
                          checked={selectedBrands.includes(brand)}
                          onChange={() => toggleBrand(brand)}
                          className="mr-2 h-4 w-4 text-[#18ABC6] rounded focus:ring-[#18ABC6]"
                        />
                        <span className="text-sm">{brand}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSelectedCategory("All Products");
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 10000 });
                  }}
                  className="w-full text-[#fd346e] font-medium py-2 border border-[#fd346e] rounded-lg hover:bg-[#fd346e] hover:text-white transition text-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Special Offer Banner */}
            <div className="bg-gradient-to-r from-[#18ABC6] to-[#0f7a94] rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2 text-sm">Summer Sale</h3>
              <p className="text-xs mb-4">
                Get up to 30% off on selected items
              </p>
              <button className="w-full bg-white text-[#18ABC6] py-2 rounded-lg text-sm font-medium">
                <Link href="/products">Shop Now</Link>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="sm:w-3/4 w-full">
            <div className="flex sm:flex-row flex-col justify-between items-center mb-8 gap-4">
              <p className="text-gray-600">
                {sortedProducts.length} products found
              </p>

              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Sort by:</span>
                <select
                  className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6] text-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-6">
              {sortedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {product.image ? (
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    {product.isNew && (
                      <span className="absolute top-2 left-2 bg-[#fd346e] text-white text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                    {!product.inStock && (
                      <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs px-2 py-1 rounded">
                        OUT OF STOCK
                      </span>
                    )}
                    <span className="absolute bottom-2 left-2 bg-[#18ABC6] bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                      {product.brand || "TechStore"}
                    </span>
                    {product.featured && (
                      <span className="absolute top-2 right-2 bg-[#18ABC6] text-white text-xs px-2 py-1 rounded">
                        FEATURED
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        href={`/product/${product.id}`}
                        className="font-[500] text-lg text-[#1c274c] hover:text-[#18ABC6] transition"
                      >
                        {product.name}
                      </Link>
                      <div className="flex flex-col items-end">
                        <span className="font-[600] text-xl text-[#1c274c]">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-gray-500 line-through text-sm">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <StarRating rating={product.rating} />
                    <p className="text-gray-600 text-sm my-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {(product.tags || []).slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-gray-100 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className={`w-full py-2 rounded font-[500] transition ${
                        product.inStock
                          ? "bg-[#18ABC6] text-white hover:bg-[#0f7a94]"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-12 bg-white rounded-2xl shadow-md">
                <p className="text-gray-600 mb-4">
                  No products found matching your criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("All Products");
                    setSelectedBrands([]);
                    setPriceRange({ min: 0, max: 10000 });
                    setSearchQuery("");
                  }}
                  className="px-4 bg-[#18ABC6] text-white py-2 rounded font-[500]"
                >
                  Reset Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > 0 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition">
                    &lt;
                  </button>
                  <button className="w-10 h-10 bg-[#18ABC6] text-white rounded flex items-center justify-center">
                    1
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition">
                    2
                  </button>
                  <button className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition">
                    3
                  </button>
                  <span className="px-2 text-gray-600">...</span>
                  <button className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center hover:bg-gray-200 transition">
                    &gt;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <CartDropdown
          cartItems={cartItems}
          cartTotal={cartTotal}
          showCart={showCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}