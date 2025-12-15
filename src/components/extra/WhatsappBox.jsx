import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";

const WhatsappBox = () => {
  const [message, setMessage] = useState("");

  const sendWhatsappMessage = () => {
    if (!message.trim()) return;

    const phone = "923399650031";
    const encoded = encodeURIComponent(message);

    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  return (
    <div className="w-full pt-20 py-12 text-white flex justify-center px-4">
      <div
        className="
          w-full 
          md:w-1/2  
          py-12 
          bg-black 
          flex 
          justify-center 
          px-5 
          rounded-md
        "
      >
        <div className="max-w-xl w-full flex flex-col items-center">
          <h2 className="text-2xl font-bold tracking-wide mb-3 text-center">
            Contact Us on WhatsApp
          </h2>

          <p className="text-sm text-gray-300 mb-5 text-center px-2">
            Have a question about perfumes? Need suggestions? Send us a quick
            message on WhatsApp!
          </p>

          {/* Input + Button (Responsive) */}
          <div className="flex w-full flex-col sm:flex-row">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="
                w-full 
                bg-white 
                px-4 py-3 
                text-black 
                rounded-md 
                sm:rounded-l-md sm:rounded-r-none
                focus:outline-none 
                mb-3 sm:mb-0
              "
            />

            <button
              onClick={sendWhatsappMessage}
              className="
                bg-white 
                text-black 
                font-semibold 
                px-5 py-3 
                rounded-md
                sm:rounded-r-md sm:rounded-l-none
                flex items-center justify-center gap-2 
                hover:bg-gray-200 
                transition
                w-full sm:w-auto
              "
            >
              <FaWhatsapp className="text-green-600 text-xl" />
              Send
            </button>
          </div>

          <p className="text-xs mt-3 text-gray-400 text-center">
            We reply within a few minutes ⚡
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsappBox;
