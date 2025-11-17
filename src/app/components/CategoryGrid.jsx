import Link from "next/link";

const CategoryGrid = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <section className="w-full mb-12">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Shop by Category</h2>
      <div className="grid sm:grid-cols-3 grid-cols-2 gap-4">
        {categories.slice(0, 6).map(category => (
          <Link 
            href="/products"
            key={category.name} 
            className="bg-white p-4 rounded-2xl shadow-md flex flex-col items-center cursor-pointer hover:shadow-lg transition-shadow  hover:border-[#18ABC6]"
            onClick={() => setSelectedCategory(category.name === "All Products" ? "All Products" : category.name)}
          >
            <div className="text-3xl text-[#18ABC6] mb-2">{category.icon}</div>
            <h3 className="font-medium text-center">{category.name}</h3>
            <p className="text-gray-500 text-sm">{category.count} items</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;