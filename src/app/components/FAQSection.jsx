const FAQSection = () => {
  const faqItems = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused products in their original packaging. Return shipping is free for items defective upon arrival."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days within the continental US. Express shipping options are available at checkout for delivery within 1-2 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to over 50 countries worldwide. International shipping rates and delivery times vary by location and will be calculated at checkout."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secure and encrypted."
    }
  ];

  return (
    <section className="w-full mb-12">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqItems.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-md">
            <h3 className="font-semibold text-[#1c274c] mb-2">{item.question}</h3>
            <p className="text-gray-600">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;