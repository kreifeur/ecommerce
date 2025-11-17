import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const ContactInfo = () => {
  return (
    <div className="lg:w-1/3 w-full">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Get in Touch</h2>
      
      <div className="space-y-6">
        <div className="flex items-start">
          <div className="bg-[#18ABC6] p-3 rounded-full mr-4">
            <FaPhone className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1c274c]">Phone</h3>
            <p className="text-gray-600">+1 (555) 123-4567</p>
            <p className="text-gray-600">+1 (555) 987-6543</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-[#18ABC6] p-3 rounded-full mr-4">
            <FaEnvelope className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1c274c]">Email</h3>
            <p className="text-gray-600">support@techstore.com</p>
            <p className="text-gray-600">sales@techstore.com</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-[#18ABC6] p-3 rounded-full mr-4">
            <FaMapMarkerAlt className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1c274c]">Address</h3>
            <p className="text-gray-600">123 Tech Avenue</p>
            <p className="text-gray-600">San Francisco, CA 94107</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="bg-[#18ABC6] p-3 rounded-full mr-4">
            <FaClock className="text-white text-lg" />
          </div>
          <div>
            <h3 className="font-semibold text-[#1c274c]">Business Hours</h3>
            <p className="text-gray-600">Monday-Friday: 9AM - 6PM</p>
            <p className="text-gray-600">Saturday: 10AM - 4PM</p>
            <p className="text-gray-600">Sunday: Closed</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="font-semibold text-[#1c274c] mb-4">Follow Us</h3>
        <div className="flex gap-4">
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-[#1877F2] cursor-pointer hover:bg-gray-200 transition">
            <FaFacebookF />
          </div>
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-[#1DA1F2] cursor-pointer hover:bg-gray-200 transition">
            <FaTwitter />
          </div>
          <div className="bg-gray-100 w-10 h-10 rounded-full flex items-center justify-center text-[#E1306C] cursor-pointer hover:bg-gray-200 transition">
            <FaInstagram />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;