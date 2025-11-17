"use client";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { usePathname } from "next/navigation";

const Navbar = ({ 
  searchQuery, 
  setSearchQuery, 
  cartItems, 
  showCart, 
  setShowCart 
}) => {
  const pathname = usePathname();
  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/deals", label: "Deals" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" }
  ];

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex items-center justify-between w-full h-[10vh] sticky top-0 border-b bg-white z-[200] px-2 mb-2">
      <div className="font-[600] text-xl">
        Tech
        <span className="text-[#18ABC6] font-[600] text-xl">Store</span>
      </div>
      <ul className="sm:flex hidden items-center gap-6">
        {navLinks.map((link) => (
          <li key={link.href}>
            <a 
              className={`font-[500] cursor-pointer ${
                isActiveLink(link.href) ? 'text-[#18ABC6]' : 'text-gray-700 hover:text-[#18ABC6]'
              }`} 
              href={link.href}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#18ABC6] w-48"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowCart(!showCart)}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <FaShoppingCart className="text-[#1c274c]" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#fd346e] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
        <div className="sm:flex hidden items-center gap-4">
          <a href="/signin" className="font-[500]">Sign In</a>
          <a href="/signup" className="px-4 bg-[#18ABC6] text-white py-2 rounded font-[500] shadow">
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;