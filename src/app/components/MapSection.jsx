import { FaMapMarkerAlt } from "react-icons/fa";

const MapSection = () => {
  return (
    <section className="w-full mb-12">
      <h2 className="text-2xl font-semibold text-[#1c274c] mb-6">Our Location</h2>
      
      <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
        <div className="text-center">
          <FaMapMarkerAlt className="text-4xl text-[#18ABC6] mx-auto mb-4" />
          <p className="text-gray-600">Interactive map would be displayed here</p>
          <p className="text-sm text-gray-500 mt-2">123 Tech Avenue, San Francisco, CA 94107</p>
        </div>
      </div>
    </section>
  );
};

export default MapSection;