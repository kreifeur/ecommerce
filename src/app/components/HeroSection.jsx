import { BiSolidOffer } from "react-icons/bi";

const HeroSection = () => {
  return (
    <section className="w-full py-8 mb-12 bg-gradient-to-r from-[#18ABC6] to-[#0f7a94] rounded-2xl text-white p-8">
      <div className="flex sm:flex-row flex-col items-center justify-between">
        <div className="sm:w-1/2 w-full mb-6 sm:mb-0">
          <h1 className="text-4xl font-bold mb-4">Tech Innovation for Everyone</h1>
          <p className="text-lg mb-6">Discover the latest laptops and accessories at unbeatable prices with fast shipping and 24/7 support.</p>
          <div className="flex gap-4">
            <button className="px-6 bg-white text-[#18ABC6] py-3 rounded-full  shadow">
              <a className="font-[500]" href="/products">Shop Now</a>
            </button>
            <button className="px-6 bg-transparent border border-white text-white py-3 rounded-full ">
               <a className="font-[500]" href="/about">About us</a>
            </button>
          </div>
        </div>
        <div className="sm:w-2/5 w-full">
          <div className="bg-white bg-opacity-20 p-6 rounded-2xl">
            <h3 className="text-xl font-semibold mb-4">Summer Sale</h3>
            <p className="mb-4">Up to 30% off on selected items. Limited time offer!</p>
            <div className="flex items-center gap-2">
              <BiSolidOffer className="text-2xl" />
              <span className="font-bold">ENDS IN: 5 days 12:45:32</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;