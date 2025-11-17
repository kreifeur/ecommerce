import ProductCard from "./ProductCard";

const ProductGrid = ({ 
  products, 
  selectedCategory, 
  onAddToCart 
}) => {
  return (
    <section className="w-full mb-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#1c274c]">
          {selectedCategory === "All Products" ? "All Products" : selectedCategory}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Sort by:</span>
          <select className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]">
            <option>Best Match</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Highest Rated</option>
            <option>Newest First</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-4 grid-cols-1 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No products found matching your criteria.</p>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;