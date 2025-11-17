const BrandsSection = ({ brands }) => {
  return (
    <a href="/products" className="w-full mb-12">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Shop by Brand</h2>
      <div className="grid sm:grid-cols-4 grid-cols-2 gap-4">
        {brands.map(brand => (
          <div key={brand} className="bg-white p-4 rounded-2xl shadow-md flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow">
            <span className="font-medium">{brand}</span>
          </div>
        ))}
      </div>
    </a>
  );
};

export default BrandsSection;