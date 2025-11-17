import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
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
      <span className="ml-1 text-sm text-gray-600">({rating})</span>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart }) => {
  return (
    
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div style={{backgroundImage: `url(${product.image})`}} className="h-48 bg-gray-100 relative bg-cover bg-center">
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
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <a href={`/product/${product.id}`} className="font-[500] text-lg text-[#1c274c]">{product.name}</a>
          <div className="flex flex-col items-end">
            <span className="font-[600] text-xl text-[#1c274c]">${product.price}</span>
            {product.originalPrice > product.price && (
              <span className="text-gray-500 line-through text-sm">${product.originalPrice}</span>
            )}
          </div>
        </div>
        <StarRating rating={product.rating} />
        <p className="text-gray-600 text-sm my-3">{product.description}</p>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {product.colors.slice(0, 2).map((feature, index) => (
            <span key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
              {feature}
            </span>
          ))}
        </div>
        
        <button 
          onClick={() => onAddToCart(product)}
          disabled={!product.inStock}
          className={`w-full py-2 rounded font-[500] ${
            product.inStock 
              ? "bg-[#18ABC6] text-white hover:bg-[#0f7a94]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {product.inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;