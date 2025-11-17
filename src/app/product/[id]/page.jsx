"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FaFacebookF, FaInstagram, FaTwitter, FaShoppingCart, FaStar, FaRegStar, FaStarHalfAlt, FaHeart, FaArrowLeft } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import CartDropdown from "../../components/CartDropdown";
import { getProduct, getFeaturedProducts } from "../../../lib/firestore";
import Link from "next/link";

export default function ProductPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const params = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      if (!params?.id) return;
      
      try {
        setLoading(true);
        const productData = await getProduct(params.id);
        
        if (productData) {
          setProduct(productData);
          
          // Fetch related products (featured products from same category)
          const featured = await getFeaturedProducts();
          const related = featured
            .filter(p => p.id !== params.id && p.category === productData.category)
            .slice(0, 4);
          setRelatedProducts(related);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [params?.id]);

  const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400" />
        ))}
        {hasHalfStar && <FaStarHalfAlt className="text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaRegStar key={`empty-${i}`} className="text-yellow-400" />
        ))}
      </div>
    );
  };

  // Sample reviews (in a real app, these would come from Firebase)
  const reviews = [
    {
      id: 1,
      user: "Sarah Johnson",
      rating: 5,
      date: "2025-08-15",
      title: "Absolutely incredible product",
      content: "This is by far the best product I've ever used. The quality is unmatched and it works perfectly for my needs.",
      verified: true
    },
    {
      id: 2,
      user: "Michael Chen",
      rating: 4,
      date: "2025-08-10",
      title: "Great but expensive",
      content: "The quality is outstanding and the build is excellent. Only giving 4 stars because of the price tag.",
      verified: true
    },
    {
      id: 3,
      user: "Emma Williams",
      rating: 5,
      date: "2025-08-05",
      title: "Perfect for my needs",
      content: "This product handles everything I need without any issues. Very satisfied with my purchase.",
      verified: false
    }
  ];

  // Add to cart function
  const addToCart = (productToAdd, qty = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === productToAdd.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === productToAdd.id 
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { 
        ...productToAdd, 
        quantity: qty,
        image: productToAdd.images?.[0] || productToAdd.image
      }];
    });
    
    // Show success message
    alert(`Added ${qty} ${productToAdd.name} to cart!`);
  };

  // Handle adding the main product to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  // Update quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      setCartItems(cartItems.filter(item => item.id !== productId));
    } else {
      setCartItems(cartItems.map(item => 
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18ABC6] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <Link 
            href="/products"
            className="bg-[#18ABC6] text-white px-6 py-2 rounded-lg hover:bg-[#0f7a94] transition"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  // Generate product images array
  const productImages = product.images || (product.image ? [product.image] : []);
  
  // Generate features if not provided
  const productFeatures = product.features || [
    "High-quality materials and construction",
    "Excellent performance and reliability",
    "Great value for the price",
    "Perfect for everyday use",
    "Backed by our satisfaction guarantee"
  ];

  // Generate specifications if not provided
  const productSpecifications = product.specifications || {
    "Material": "Premium quality materials",
    "Dimensions": "Standard size for easy use",
    "Weight": "Lightweight and portable",
    "Warranty": product.warranty || "1 Year Limited Warranty",
    "Brand": product.brand || "TechStore",
    "Category": product.category
  };

  // Generate colors if not provided
  const productColors = product.colors || ["Black", "White"];

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

        {/* Back button */}
        <div className="w-full py-4">
          <Link 
            href="/products"
            className="flex items-center gap-2 text-[#18ABC6] font-[500] hover:text-[#0f7a94] transition"
          >
            <FaArrowLeft /> Back to Products
          </Link>
        </div>

        {/* Product Section */}
        <section className="w-full flex sm:flex-row flex-col gap-8 mb-12">
          {/* Product Images */}
          <div className="sm:w-1/2 w-full">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="h-96 bg-gray-200 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                {productImages[selectedImage] ? (
                  <img 
                    src={productImages[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x600?text=No+Image";
                    }}
                  />
                ) : (
                  <span className="text-gray-500">No Image Available</span>
                )}
              </div>
              {productImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto">
                  {productImages.map((image, index) => (
                    <div 
                      key={index}
                      className={`w-20 h-20 bg-gray-200 rounded cursor-pointer flex-shrink-0 overflow-hidden ${
                        selectedImage === index ? 'ring-2 ring-[#18ABC6]' : ''
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      {image ? (
                        <img 
                          src={image} 
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/80x80?text=Image";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                          Image
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="sm:w-1/2 w-full">
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">{product.brand || "TechStore"}</span>
                {product.isNew && (
                  <span className="bg-[#fd346e] text-white text-xs px-2 py-1 rounded">
                    NEW
                  </span>
                )}
                {product.featured && (
                  <span className="bg-[#18ABC6] text-white text-xs px-2 py-1 rounded">
                    FEATURED
                  </span>
                )}
                {!product.inStock && (
                  <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                    OUT OF STOCK
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-bold text-[#1c274c] mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <StarRating rating={product.rating || 4.0} />
                <span className="text-gray-600">{reviews.length} reviews</span>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-2xl font-bold text-[#1c274c]">${product.price}</span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-gray-500 line-through">${product.originalPrice}</span>
                    <span className="bg-[#18ABC6] bg-opacity-10 text-[#18ABC6] px-2 py-1 rounded text-sm">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 mb-6">{product.description}</p>

              {/* Color Selection */}
              {productColors.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Color</h3>
                  <div className="flex gap-2 flex-wrap">
                    {productColors.map(color => (
                      <button
                        key={color}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#18ABC6] transition"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Size</h3>
                  <div className="flex gap-2 flex-wrap">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:border-[#18ABC6] transition"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity and Add to Cart */}
              <div className="flex sm:flex-row flex-col gap-4 mb-6">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button 
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className={`flex-1 py-3 rounded font-[500] transition ${
                    product.inStock 
                      ? "bg-[#18ABC6] text-white hover:bg-[#0f7a94]"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                  <FaHeart className="text-gray-600" />
                </button>
              </div>

              {/* Product Meta */}
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">SKU:</span> {product.id}
                  </div>
                  <div>
                    <span className="text-gray-500">Category:</span> {product.category}
                  </div>
                  <div>
                    <span className="text-gray-500">Warranty:</span> {product.warranty || "1 Year"}
                  </div>
                  <div>
                    <span className="text-gray-500">Delivery:</span> 2-4 business days
                  </div>
                </div>
              </div>

              {/* Share buttons */}
              <div className="flex items-center gap-4 mt-6">
                <span className="text-gray-500">Share:</span>
                <button className="text-gray-600 hover:text-[#1877F2] transition">
                  <FaFacebookF />
                </button>
                <button className="text-gray-600 hover:text-[#1DA1F2] transition">
                  <FaTwitter />
                </button>
                <button className="text-gray-600 hover:text-[#E1306C] transition">
                  <FaInstagram />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Product Tabs */}
        <section className="w-full mb-12">
          <div className="bg-white rounded-2xl shadow-md">
            {/* Tab Navigation */}
            <div className="border-b border-gray-200">
              <nav className="flex overflow-x-auto">
                {["description", "specifications", "reviews", "shipping"].map(tab => (
                  <button
                    key={tab}
                    className={`px-6 py-4 font-medium capitalize whitespace-nowrap ${
                      activeTab === tab 
                        ? 'text-[#18ABC6] border-b-2 border-[#18ABC6]' 
                        : 'text-gray-600 hover:text-[#1c274c]'
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "description" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Product Description</h3>
                  <p className="text-gray-600 mb-6">{product.description}</p>
                  
                  <h4 className="font-semibold mb-3">Key Features</h4>
                  <ul className="grid sm:grid-cols-2 grid-cols-1 gap-3">
                    {productFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-[#18ABC6] mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {activeTab === "specifications" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Technical Specifications</h3>
                  <div className="space-y-4">
                    {Object.entries(productSpecifications).map(([key, value]) => (
                      <div key={key} className="flex border-b border-gray-100 pb-3">
                        <div className="w-1/3 font-medium text-gray-700">{key}</div>
                        <div className="w-2/3 text-gray-600">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                  
                  {/* Review Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-[#1c274c]">{product.rating || 4.0}</div>
                        <StarRating rating={product.rating || 4.0} />
                        <div className="text-sm text-gray-600 mt-1">{reviews.length} reviews</div>
                      </div>
                      <div className="flex-1">
                        {[5, 4, 3, 2, 1].map(stars => (
                          <div key={stars} className="flex items-center gap-2 mb-1">
                            <div className="w-10 text-sm">{stars} star</div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ 
                                  width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%` 
                                }}
                              ></div>
                            </div>
                            <div className="w-10 text-sm text-right">
                              {stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 7 : stars === 2 ? 2 : 1}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-6">
                    {reviews.map(review => (
                      <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.user}</h4>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} />
                              <span className="text-sm text-gray-500">{review.date}</span>
                              {review.verified && (
                                <span className="text-xs bg-[#18ABC6] bg-opacity-10 text-[#18ABC6] px-2 py-1 rounded">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <h5 className="font-medium mb-1">{review.title}</h5>
                        <p className="text-gray-600">{review.content}</p>
                      </div>
                    ))}
                  </div>

                  <button className="mt-6 px-6 py-2 border border-[#18ABC6] text-[#18ABC6] rounded-lg hover:bg-[#18ABC6] hover:text-white transition">
                    Write a Review
                  </button>
                </div>
              )}

              {activeTab === "shipping" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Shipping & Returns</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Shipping</h4>
                      <p className="text-gray-600">
                        We offer free standard shipping on orders over $499. Most orders are processed within 24 hours and delivered within 2-4 business days. Express shipping options are available at checkout.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Returns</h4>
                      <p className="text-gray-600">
                        We offer a 30-day return policy for unused products in original packaging. Return shipping is free for defective items. Please contact our support team to initiate a return.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Warranty</h4>
                      <p className="text-gray-600">
                        This product comes with a {product.warranty || "1-year limited"} warranty that covers manufacturing defects. Extended warranty options are available at checkout.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="w-full mb-12">
            <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">You might also like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 grid-cols-1 gap-6">
              {relatedProducts.map(relatedProduct => (
                <div key={relatedProduct.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    {relatedProduct.images?.[0] || relatedProduct.image ? (
                      <img 
                        src={relatedProduct.images?.[0] || relatedProduct.image} 
                        alt={relatedProduct.name}
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
                    <div className="absolute top-2 left-2 bg-[#18ABC6] bg-opacity-90 text-white text-xs px-2 py-1 rounded">
                      {relatedProduct.brand || "TechStore"}
                    </div>
                    {relatedProduct.isNew && (
                      <span className="absolute top-2 right-2 bg-[#fd346e] text-white text-xs px-2 py-1 rounded">
                        NEW
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Link 
                        href={`/product/${relatedProduct.id}`}
                        className="font-[500] text-lg text-[#1c274c] hover:text-[#18ABC6] transition line-clamp-2"
                      >
                        {relatedProduct.name}
                      </Link>
                      <div className="flex flex-col items-end">
                        <span className="font-[600] text-xl text-[#1c274c]">${relatedProduct.price}</span>
                        {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                          <span className="text-gray-500 line-through text-sm">${relatedProduct.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{relatedProduct.description}</p>
                    <button 
                      onClick={() => addToCart(relatedProduct, 1)}
                      className="w-full bg-[#18ABC6] text-white py-2 rounded font-[500] hover:bg-[#0f7a94] transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cart Dropdown */}
        <CartDropdown
          cartItems={cartItems}
          cartTotal={cartTotal}
          showCart={showCart}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
      </div>

      <Footer/>
    </div>
  );
}