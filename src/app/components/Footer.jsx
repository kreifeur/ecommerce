import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full bg-[#1c274c] text-white py-12">
      <div className="w-[90%] mx-auto grid sm:grid-cols-4 grid-cols-1 gap-8">
        <div className="flex flex-col gap-4">
          <div className="font-[600] text-xl">
            Tech
            <span className="text-[#18ABC6] font-[600] text-xl">Store</span>
          </div>
          <p className="text-gray-300">
            Your one-stop shop for the latest laptops and tech accessories at competitive prices.
          </p>
          <div className="flex gap-4">
            <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center bg-[#1877F2]">
              <FaFacebookF />
            </div>
            <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center bg-[#1DA1F2]">
              <FaTwitter />
            </div>
            <div className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center bg-[#E1306C]">
              <FaInstagram />
            </div>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Shop</h3>
          <ul className="flex flex-col gap-2 text-gray-300">
            {["Laptops", "Accessories", "Tablets", "Deals", "New Arrivals"].map((item) => (
              <a href="/products" key={item} className="hover:text-white cursor-pointer">{item}</a>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Support</h3>
          <ul className="flex flex-col gap-2 text-gray-300">
            {["Contact Us", "FAQs", "Shipping", "Returns", "Warranty"].map((item) => (
              <a href={`/${'contact'}`} key={item} className="hover:text-white cursor-pointer">{item}</a>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold">Newsletter</h3>
          <p className="text-gray-300">
            Subscribe to get special offers, free giveaways, and new product alerts.
          </p>
          <form className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="p-2 rounded text-gray-800"
              required
            />
            <button
              type="submit"
              className="px-4 bg-[#18ABC6] text-white py-2 rounded font-[500]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      <div className="w-[90%] mx-auto border-t border-gray-700 mt-8 pt-8 flex sm:flex-row flex-col justify-between items-center">
        <div className="text-gray-400 text-sm">
          © 2025 TechStore. All rights reserved.
        </div>
        <div className="flex gap-6 text-gray-400 text-sm">
          {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
            <span key={item} className="hover:text-white cursor-pointer">{item}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;