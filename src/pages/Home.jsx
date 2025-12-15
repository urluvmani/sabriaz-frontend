import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import RowsOFProducts from "../components/extra/RowsOFProducts";
import WhatsappBox from "../components/extra/WhatsappBox";
import CategoryShowcase from "../components/extra/CategoryShowcase";

const Home = () => {
  const [settings, setSettings] = useState({
    homeBannerImage: "",
    homeBannerTitle: "",
    homeBannerSubtitle: "",
    homeBannerLink: "",
  });

  const [products, setProducts] = useState([]);
  const [isFeatured, setisFeatured] = useState([]);

  const fetchSettings = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/settings"
    );
    if (res.data) setSettings(res.data);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/products"
      );
      setProducts(res.data);

      const filtered = res.data
        .filter((p) => p.isFeatured === true)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

      setisFeatured(filtered);
    } catch (err) {
      console.log("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchSettings();
    fetchProducts();
  }, []);
  useEffect(() => {
    document.title =
      "Sabriaz – Premium Perfume Store in Pakistan | Long Lasting Fragrances";
  }, []);

  const {
    homeBannerImage,
    homeBannerTitle,
    homeBannerSubtitle,
    globalOfferText,
    homeBannerLink,
  } = settings;

  return (
    <div className="min-h-screen pt-15 bg-gray-50">
      {/* ---------------- BANNER ---------------- */}
      <div className="banner relative w-full h-[80vh] bg-black/40">
        {/* Image */}
        <img
          className="object-cover object-[right_80%] w-full h-full"
          src={homeBannerImage || "mokup.png"}
          alt="banner"
        />

        {/* LEFT TEXT BOX */}
        <div
          className="
            absolute top-0 left-0 
            w-full md:w-1/2 
            h-full 
            gap-1 flex flex-col justify-center items-center 
            text-white bg-black/40
            px-4 text-center md:text-left 
          "
        >
          <h1 className="text-3xl md:text-4xl font-bold">{homeBannerTitle}</h1>
          <h1 className="text-md md:text-lg font-semibold">
            {homeBannerSubtitle}
          </h1>

          <h4 className="mb-4 text-yellow-400 font-semibold text-sm md:text-base">
            {globalOfferText}
          </h4>

          <Link
            to={homeBannerLink || "#"}
            className="rounded-md bg-yellow-700 hover:bg-yellow-800 text-white font-semibold transition-all duration-300 text-lg py-2 px-4"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* ---------- SEPARATOR ---------- */}
      <div className="h-20 w-full separator mt-5">
        <div className="flex w-full justify-center items-center">
          <img src="icon2.png" alt="icon" className="w-14 h-14 mb-2" />
        </div>

        <div className="flex gap-4 md:gap-7 justify-center items-center px-3">
          <div className="w-[25vw] md:w-[40vw] h-[1px] bg-black"></div>
          <p className="text-sm font-semibold text-yellow-700">
            Luxury&nbsp; Perfumes
          </p>
          <div className="w-[25vw] md:w-[40vw] h-[1px] bg-black"></div>
        </div>
      </div>

      {/* ---------- HEADINGS ---------- */}
      <div className="headings py-10 flex flex-col items-center gap-1 px-5 text-center">
        <h1 className="text-lg font-bold">
          Discover fragrances that define your presence.
        </h1>
        <h2 className="text-sm md:text-base">
          Crafted with precision, inspired by elegance, made to last all day.
        </h2>
        <h3 className="text-yellow-700 font-semibold">
          Experience luxury that stays with you.
        </h3>
      </div>

      {/* ---------------- isFeatured SHOWCASE ---------------- */}
      <div
        className={`
    productsShowCase
    flex items-center   md:justify-center
    gap-3
    h-[20vh] md:h-[55vh]
    px-3
    ${isFeatured.length === 1 && "justify-center"}
    overflow-x-auto md:overflow-visible
    scrollbar-hide
  `}
      >
        {isFeatured.length === 0 ? (
          <h2 className="text-gray-500 mx-auto">No featured products yet.</h2>
        ) : (
          isFeatured.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="
          min-w-[160px] sm:min-w-[200px] md:w-80
          h-[100%]
          relative group flex-shrink-0
        "
            >
              <img
                className="
            object-cover absolute inset-0
            w-full h-full
            opacity-100 group-hover:opacity-0
            transition-opacity duration-500
            rounded-lg
          "
                src={p.images?.[0] || "noimg.webp"}
                alt=""
              />
              <img
                className="
            object-cover absolute inset-0
            w-full h-full
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
            rounded-lg
          "
                src={p.images?.[1] || p.images?.[0]}
                alt=""
              />
            </Link>
          ))
        )}
      </div>

      {/* ---------- CATEGORY SHOWCASE ---------- */}
      <CategoryShowcase />

      {/* ---------------- NEW ARRIVALS ---------------- */}
      <div className="NewArrivals w-full min-h-[80vh] mt-10">
        <h1 className="text-black font-bold text-2xl font-serif text-center py-5">
          New Arrivals
        </h1>

        <RowsOFProducts />

        <div className="w-full flex justify-center my-5">
          <Link
            to={"/shop"}
            className="rounded-md bg-black text-white hover:scale-105 transition-all py-2 px-3 text-lg"
          >
            View All
          </Link>
        </div>
      </div>

      {/* CONTACT SEPARATOR */}
      <div className="h-0 w-full separator mt-10">
        <div className="flex gap-4 md:gap-7 justify-center items-center">
          <div className="w-[25vw] md:w-[40vw] h-[1px] bg-black"></div>
          <p className="text-sm font-semibold text-yellow-700">Contact Us</p>
          <div className="w-[25vw] md:w-[40vw] h-[1px] bg-black"></div>
        </div>
      </div>

      <WhatsappBox />
    </div>
  );
};

export default Home;
