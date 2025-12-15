import { useEffect, useState } from "react";
import axios from "axios";

const About = () => {
  const [data, setData] = useState(null);

  const fetchAbout = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/about"
    );
    setData(res.data);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="pt-20 w-full font-serif">
      {/* ================= HERO SECTION ================= */}
      <div
        className="
        relative w-full h-auto md:h-[85vh] 
        flex flex-col md:flex-row
      "
      >
        {/* LEFT CONTENT */}
        <div
          className="
          w-full md:w-1/2 
          flex flex-col justify-center 
          px-6 md:px-16 
          py-10 md:py-0 
          z-20 text-center md:text-left
        "
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 drop-shadow-xl">
            {data.title}
          </h1>

          <p className="mt-4 md:mt-6 text-lg md:text-xl text-gray-700 leading-relaxed">
            {data.subtitle}
          </p>
        </div>

        {/* RIGHT IMAGE */}
        <div
          className="
            w-full md:w-1/2 
            h-[300px] md:h-full 
            bg-cover bg-center md:bg-left relative
          "
          style={{ backgroundImage: `url(${data.image1})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/40 to-transparent"></div>
        </div>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <p className="text-lg md:text-xl leading-7 md:leading-9 text-gray-700 text-center tracking-wide">
          {data.description}
        </p>
      </div>

      {/* ================= SECOND IMAGE ================= */}
      {data.image2 && (
        <div className="max-w-xl bg-white rounded-2xl mx-auto p-3 md:px-6 md:py-5">
          <img
            src={data.image2}
            className="w-full h-[250px] sm:h-[350px] md:h-[420px] rounded-2xl object-contain"
            alt="About"
          />
        </div>
      )}

      {/* ================= MISSION & VISION ================= */}
      <div
        className="
        max-w-6xl mx-auto px-4 md:px-6 py-16 md:py-20 
        grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10
      "
      >
        <div className="bg-white shadow-lg p-6 md:p-10 rounded-2xl border-l-8 border-black">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide mb-4">
            Our Mission
          </h2>
          <p className="text-md md:text-lg text-gray-700 leading-7 md:leading-8">
            {data.mission}
          </p>
        </div>

        <div className="bg-white shadow-lg p-6 md:p-10 rounded-2xl border-l-8 border-gray-800">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-wide mb-4">
            Our Vision
          </h2>
          <p className="text-md md:text-lg text-gray-700 leading-7 md:leading-8">
            {data.vision}
          </p>
        </div>
      </div>

      {/* ================= FOOTER QUOTE ================= */}
      <div className="py-12 md:py-20 bg-gray-100 text-center px-4">
        <p className="text-xl md:text-3xl italic text-gray-600 tracking-wide leading-relaxed">
          “Fragrance is the art that makes memories unforgettable.”
        </p>
      </div>
    </div>
  );
};

export default About;
