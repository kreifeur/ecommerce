const SpecialOffers = ({ offers }) => {
  return (
    <section className="w-full mb-12">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Special Offers</h2>
      <div className="grid sm:grid-cols-2 grid-cols-1 gap-6">
        {offers.map(offer => (
          <div key={offer.id} className="bg-gradient-to-r from-[#fd346e] to-[#ff6b9c] rounded-2xl p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{offer.title}</h3>
                <p className="mb-4">{offer.description}</p>
                <a href="/products" className="px-4 bg-white text-[#fd346e] py-2 rounded font-[500]">
                  Shop Now
                </a>
              </div>
              <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-semibold">
                {offer.discount}
              </span>
            </div>
            <div className="mt-4 pt-4 border-t border-white border-opacity-20">
              <p className="text-sm">Offer expires: {new Date(offer.expires).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SpecialOffers;