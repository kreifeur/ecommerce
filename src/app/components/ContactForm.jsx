const ContactForm = ({ formData, handleChange, handleSubmit, isSubmitted }) => {
  return (
    <div className="lg:w-2/3 w-full bg-white rounded-2xl p-8 shadow-md">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Send us a Message</h2>
      
      {isSubmitted && (
        <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
          Thank you for your message! We'll get back to you as soon as possible.
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
            required
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6]"
            required
          ></textarea>
        </div>
        
        <button
          type="submit"
          className="px-6 bg-[#18ABC6] text-white py-3 rounded-lg font-medium hover:bg-[#0f7a94] transition"
        >
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ContactForm;