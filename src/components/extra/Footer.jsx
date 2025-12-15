import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import axios from "axios";
import { useState } from "react";

const Footer = () => {
  const [email, setEmail] = useState("");

  const subscribe = async () => {
    if (!email.trim()) {
      alert("Please enter a valid email");
      return;
    }

    try {
      const res = await axios.post(
        "https://sabriaz-backend.onrender.com/api/subscribe",
        {
          email,
        }
      );
      alert(res.data.message);
      setEmail("");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <footer className="bg-black text-gray-300 pt-12 pb-5 font-sans">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {/* BRAND INFO */}
        <div className="text-center lg:text-left">
          <h2 className="text-3xl font-serif text-white tracking-wide">
            Sabriaz
          </h2>
          <p className="mt-3 text-sm leading-6">
            Discover luxury fragrances crafted with passion, elegance and
            purity.
          </p>

          {/* SOCIAL LINKS */}
          <div className="flex gap-4 mt-4 justify-center lg:justify-start">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
            >
              <FaFacebookF size={18} />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
            >
              <FaInstagram size={18} />
            </a>

            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
            >
              <FaTiktok size={18} />
            </a>

            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition"
            >
              <FaYoutube size={18} />
            </a>
          </div>
        </div>

        {/* SHOP LINKS */}
        <div className="text-center lg:text-left">
          <h3 className="text-lg text-white font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/shop" className="hover:text-yellow-500">
                All Products
              </Link>
            </li>
            <li>
              <Link to="/category/men" className="hover:text-yellow-500">
                Men’s Perfumes
              </Link>
            </li>
            <li>
              <Link to="/category/women" className="hover:text-yellow-500">
                Women’s Perfumes
              </Link>
            </li>
            <li>
              <Link to="/category/attars" className="hover:text-yellow-500">
                Attars
              </Link>
            </li>
            <li>
              <Link to="/category/gift-sets" className="hover:text-yellow-500">
                Gift Sets
              </Link>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div className="text-center lg:text-left">
          <h3 className="text-lg text-white font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center justify-center lg:justify-start gap-2">
              <FaLocationDot className="text-yellow-600" />
              <span>Faisalabad, Pakistan</span>
            </li>

            <li>
              <span className="block">Phone:</span>
              <a href="tel:+923399650031" className="text-yellow-500">
                +92 339 9650031
              </a>
            </li>

            <li>
              <span className="block">Email:</span>
              <a
                href="mailto:muzammil786@gmail.com"
                className="text-yellow-500 break-all"
              >
                muzammil786@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* NEWSLETTER */}
      <div className="max-w-7xl mx-auto mt-10 px-6">
        <div className="border-t border-gray-700 pt-8 pb-6 text-center">
          <h3 className="text-lg text-white font-semibold mb-3">
            Subscribe for Exclusive Offers
          </h3>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 rounded-md text-black bg-white outline-none"
            />

            <button
              onClick={subscribe}
              className="bg-yellow-600 text-white px-5 py-2 rounded-md sm:rounded-r-md sm:rounded-l-none hover:bg-yellow-700 transition w-full sm:w-auto"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="border-t border-gray-800 mt-8 pt-4 text-center text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="text-yellow-500">Sabriaz</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
