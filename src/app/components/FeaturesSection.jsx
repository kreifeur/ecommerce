const FeaturesSection = () => {
  return (
    <section className="w-full mb-12 bg-gray-100 rounded-2xl p-8">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-8">
        <div className="text-center">
          <div className="text-3xl text-[#18ABC6] mb-4">🚚</div>
          <h3 className="font-semibold mb-2">Free Shipping</h3>
          <p className="text-gray-600">On all orders over $499</p>
        </div>
        <div className="text-center">
          <div className="text-3xl text-[#18ABC6] mb-4">↩️</div>
          <h3 className="font-semibold mb-2">30-Day Returns</h3>
          <p className="text-gray-600">Money-back guarantee</p>
        </div>
        <div className="text-center">
          <div className="text-3xl text-[#18ABC6] mb-4">🔒</div>
          <h3 className="font-semibold mb-2">Secure Payment</h3>
          <p className="text-gray-600">Safe and encrypted checkout</p>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;