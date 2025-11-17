// src/components/AdminDashboard.js
"use client";
import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../../lib/firebase";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    rating: "",
    reviewCount: "",
    features: [""],
    specifications: [{ key: "", value: "" }],
    inStock: true,
    isNew: false,
    tags: [""],
    colors: [""],
    sku: "",
    warranty: "",
    featured: false
  });

  const categories = ["Laptops", "Headphones", "Keyboards", "Mice", "Tablets", "Storage"];
  const availableColors = ["Black", "White", "Red", "Blue", "Green", "Yellow", "Purple", "Pink", "Orange", "Gray", "Space Gray", "Silver", "Gold", "Rose Gold"];
  const commonTags = ["Premium", "Professional", "Creative", "Gaming", "Budget", "Eco-Friendly", "Wireless", "Smart", "Portable", "Durable"];

  // Fetch existing products
  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productsList);
    } catch (error) {
      console.error("Error fetching products:", error);
      setMessage("Error fetching products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Extract file path from Firebase Storage URL
  const getFilePathFromUrl = (url) => {
    try {
      const baseUrl = 'https://firebasestorage.googleapis.com/v0/b/';
      const storageBucket = storage.app.options.storageBucket;
      
      if (url.includes(baseUrl) && url.includes(storageBucket)) {
        const encodedPath = url.split(`${storageBucket}/o/`)[1]?.split('?')[0];
        if (encodedPath) {
          return decodeURIComponent(encodedPath);
        }
      }
      return null;
    } catch (error) {
      console.error("Error extracting file path from URL:", error);
      return null;
    }
  };

  // Delete images from Firebase Storage
  const deleteImagesFromStorage = async (imageUrls) => {
    if (!imageUrls || imageUrls.length === 0) return;

    const deletePromises = imageUrls.map(async (url) => {
      try {
        const filePath = getFilePathFromUrl(url);
        if (filePath) {
          const storageRef = ref(storage, filePath);
          await deleteObject(storageRef);
          console.log("Deleted image:", filePath);
        }
      } catch (error) {
        if (error.code === 'storage/object-not-found') {
          console.log("Image already deleted or not found:", url);
        } else {
          console.error("Error deleting image:", error);
        }
      }
    });

    await Promise.all(deletePromises);
  };

  // Handle multiple file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setMessage(`Skipped ${file.name}: Not an image file`);
        return false;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage(`Skipped ${file.name}: File size exceeds 5MB`);
        return false;
      }

      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, { url: e.target.result, type: 'new' }]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Upload multiple images to Firebase Storage
  const uploadImages = async (files) => {
    try {
      setUploading(true);
      const uploadPromises = files.map(async (file) => {
        const fileExtension = file.name.split('.').pop();
        const fileName = `images/${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL;
      });

      const imageUrls = await Promise.all(uploadPromises);
      return imageUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      throw new Error("Failed to upload images");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array fields (features, tags, colors)
  const handleArrayFieldChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayFieldItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayFieldItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Handle specifications (key-value pairs)
  const handleSpecificationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map((spec, i) => 
        i === index ? { ...spec, [field]: value } : spec
      )
    }));
  };

  const addSpecification = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { key: "", value: "" }]
    }));
  };

  const removeSpecification = (index) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  // Add tag from common tags
  const addCommonTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags.filter(t => t !== ""), tag]
      }));
    }
  };

  // Add color from available colors
  const addCommonColor = (color) => {
    if (!formData.colors.includes(color)) {
      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors.filter(c => c !== ""), color]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!formData.name || !formData.price || !formData.category || !formData.description) {
      setMessage("Please fill in all required fields");
      setLoading(false);
      return;
    }

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0) {
      setMessage("Please upload at least one product image");
      setLoading(false);
      return;
    }

    try {
      let finalImageUrls = [...existingImages];

      if (imageFiles.length > 0) {
        const newImageUrls = await uploadImages(imageFiles);
        finalImageUrls = [...finalImageUrls, ...newImageUrls];
      }

      // Prepare specifications object
      const specificationsObj = {};
      formData.specifications.forEach(spec => {
        if (spec.key && spec.value) {
          specificationsObj[spec.key] = spec.value;
        }
      });

      // Filter out empty array items
      const filteredFeatures = formData.features.filter(feature => feature.trim() !== "");
      const filteredTags = formData.tags.filter(tag => tag.trim() !== "");
      const filteredColors = formData.colors.filter(color => color.trim() !== "");

      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        category: formData.category,
        brand: formData.brand,
        rating: formData.rating ? parseFloat(formData.rating) : 4.0,
        reviewCount: formData.reviewCount ? parseInt(formData.reviewCount) : 0,
        features: filteredFeatures,
        specifications: specificationsObj,
        inStock: formData.inStock,
        isNew: formData.isNew,
        tags: filteredTags,
        colors: filteredColors,
        sku: formData.sku,
        warranty: formData.warranty,
        featured: formData.featured,
        images: finalImageUrls,
        image: finalImageUrls[0] || "",
        createdAt: editingProduct ? formData.createdAt : new Date(),
        updatedAt: new Date()
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
        setMessage("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), productData);
        setMessage("Product created successfully!");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      setMessage("Error saving product: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      originalPrice: "",
      category: "",
      brand: "",
      rating: "",
      reviewCount: "",
      features: [""],
      specifications: [{ key: "", value: "" }],
      inStock: true,
      isNew: false,
      tags: [""],
      colors: [""],
      sku: "",
      warranty: "",
      featured: false
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setEditingProduct(null);
    
    const fileInput = document.getElementById('product-images');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const editProduct = (product) => {
    // Convert specifications object to array
    const specificationsArray = product.specifications ? 
      Object.entries(product.specifications).map(([key, value]) => ({ key, value })) : 
      [{ key: "", value: "" }];

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "",
      originalPrice: product.originalPrice?.toString() || "",
      category: product.category || "",
      brand: product.brand || "",
      rating: product.rating?.toString() || "4.0",
      reviewCount: product.reviewCount?.toString() || "",
      features: product.features?.length > 0 ? product.features : [""],
      specifications: specificationsArray,
      inStock: product.inStock !== false,
      isNew: product.isNew || false,
      tags: product.tags?.length > 0 ? product.tags : [""],
      colors: product.colors?.length > 0 ? product.colors : [""],
      sku: product.sku || "",
      warranty: product.warranty || "",
      featured: product.featured || false,
      createdAt: product.createdAt
    });
    
    const productImages = product.images || (product.image ? [product.image] : []);
    setExistingImages(productImages);
    
    const existingPreviews = productImages.map(url => ({ url, type: 'existing' }));
    setImagePreviews(existingPreviews);
    
    setEditingProduct(product);
  };

  const deleteProduct = async (product) => {
    if (window.confirm(`Are you sure you want to delete "${product.name}"? This will also delete all associated images.`)) {
      try {
        const imageUrls = product.images || (product.image ? [product.image] : []);
        
        if (imageUrls.length > 0) {
          await deleteImagesFromStorage(imageUrls);
        }
        
        await deleteDoc(doc(db, "products", product.id));
        
        setMessage("Product and its images deleted successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
        setMessage("Error deleting product: " + error.message);
      }
    }
  };

  const removeImage = (index) => {
    const previewToRemove = imagePreviews[index];
    
    if (previewToRemove.type === 'existing') {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
    } else {
      const fileIndex = imagePreviews.slice(0, index).filter(p => p.type === 'new').length;
      setImageFiles(prev => prev.filter((_, i) => i !== fileIndex));
    }
    
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeAllImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    
    const fileInput = document.getElementById('product-images');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const totalImagesCount = imagePreviews.length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {message && (
          <div className={`p-4 mb-6 rounded-lg ${
            message.includes("Error") 
              ? "bg-red-100 text-red-700 border border-red-200" 
              : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="Enter brand name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price ($)
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="Product SKU"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    min="0"
                    max="5"
                    step="0.1"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Count
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    value={formData.reviewCount}
                    onChange={handleChange}
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                    placeholder="124"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                  placeholder="Enter product description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Warranty
                </label>
                <input
                  type="text"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                  placeholder="1 Year Limited Warranty"
                />
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Features
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleArrayFieldChange('features', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                      placeholder="Enter feature"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayFieldItem('features', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayFieldItem('features')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Feature
                </button>
              </div>

              {/* Specifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specifications
                </label>
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                    <input
                      type="text"
                      value={spec.key}
                      onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                      className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                      placeholder="Specification name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={spec.value}
                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                        placeholder="Specification value"
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecification(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSpecification}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Specification
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-2">Common Tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonTags.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => addCommonTag(tag)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleArrayFieldChange('tags', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                      placeholder="Enter tag"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayFieldItem('tags', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayFieldItem('tags')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Tag
                </button>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colors
                </label>
                <div className="mb-2">
                  <p className="text-sm text-gray-600 mb-2">Common Colors:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map(color => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => addCommonColor(color)}
                        className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                {formData.colors.map((color, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => handleArrayFieldChange('colors', index, e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
                      placeholder="Enter color"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayFieldItem('colors', index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayFieldItem('colors')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  Add Color
                </button>
              </div>

              {/* Multiple Images Input Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Images *
                </label>
                
                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600">
                        {totalImagesCount} image{totalImagesCount !== 1 ? 's' : ''} selected
                        {existingImages.length > 0 && ` (${existingImages.length} existing, ${imageFiles.length} new)`}
                      </p>
                      <button
                        type="button"
                        onClick={removeAllImages}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove All
                      </button>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={preview.url} 
                            alt={`Preview ${index + 1}`} 
                            className="w-20 h-20 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                            {index + 1}
                            {preview.type === 'existing' && ' (Existing)'}
                            {preview.type === 'new' && ' (New)'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Product Images
                  </label>
                  <div className="flex items-center gap-4">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#18ABC6] transition bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP (MAX. 5MB each)</p>
                        <p className="text-xs text-gray-500 mt-1">You can select multiple images</p>
                      </div>
                      <input 
                        id="product-images"
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                        multiple
                      />
                    </label>
                  </div>
                  {imageFiles.length > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      {imageFiles.length} new image{imageFiles.length !== 1 ? 's' : ''} selected for upload
                    </p>
                  )}
                  {editingProduct && existingImages.length > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      {existingImages.length} existing image{existingImages.length !== 1 ? 's' : ''} will be kept. Remove any you don't want.
                    </p>
                  )}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="inStock"
                    checked={formData.inStock}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#18ABC6] focus:ring-[#18ABC6] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isNew"
                    checked={formData.isNew}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#18ABC6] focus:ring-[#18ABC6] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Product</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-4 w-4 text-[#18ABC6] focus:ring-[#18ABC6] border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured Product</span>
                </label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className={`flex-1 py-3 px-4 bg-[#18ABC6] text-white rounded-lg hover:bg-[#0f7a94] focus:outline-none focus:ring-2 focus:ring-[#18ABC6] transition ${
                    (loading || uploading) ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {uploading ? "Uploading Images..." : 
                   loading ? "Saving..." : 
                   editingProduct ? "Update Product" : "Create Product"}
                </button>
                
                {editingProduct && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-6">Products ({products.length})</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {products.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={product.images?.[0] || product.image} 
                        alt={product.name}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x80?text=No+Image";
                        }}
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-600">${product.price} • {product.category}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                            {(product.images?.length || (product.image ? 1 : 0))} image{(product.images?.length || 1) !== 1 ? 's' : ''}
                          </span>
                          {product.featured && (
                            <span className="text-xs bg-[#18ABC6] text-white px-2 py-1 rounded">Featured</span>
                          )}
                          {product.isNew && (
                            <span className="text-xs bg-green-500 text-white px-2 py-1 rounded">New</span>
                          )}
                          {!product.inStock && (
                            <span className="text-xs bg-red-500 text-white px-2 py-1 rounded">Out of Stock</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => editProduct(product)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteProduct(product)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {products.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No products found. Add your first product!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}