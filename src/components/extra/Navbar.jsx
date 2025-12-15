import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Menu, X } from "lucide-react";
import { logout } from "../../redux/userSlice";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const { totalQty } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  // ------------------ FETCH CATEGORIES ------------------
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          "https://sabriaz-backend.onrender.com/api/categories"
        );
        setCategories(res.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // ------------------ CLOSE DROPDOWN ON OUTSIDE CLICK ------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------ LOGOUT ------------------
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="text-white z-50 h-16 fixed w-full bg-gradient-to-r from-neutral-800 to-black flex justify-between px-5 items-center">
      {/* LOGO */}
      <Link to="/" className="text-3xl font-serif relative">
        Sabriaz
        <div className="absolute text-xs left-28 -top-0">(DJ)</div>
      </Link>

      {/* MOBILE CART + MENU BUTTON */}
      <div className="flex md:hidden items-center gap-4">
        {/* CART ICON ON MOBILE */}
        <Link to="/cart" className="relative">
          <ShoppingCart size={26} />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalQty}
            </span>
          )}
        </Link>

        {/* MENU BUTTON */}
        <button onClick={() => setMobileMenu(!mobileMenu)}>
          {mobileMenu ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ---------- DESKTOP LINKS ---------- */}
      <div className="hidden md:flex gap-10 pr-5 items-center">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/my-orders">Orders</Link>

        {/* CATEGORY DROPDOWN */}
        <div className="relative cursor-pointer" ref={dropdownRef}>
          <span
            onClick={() => setOpenDropdown(!openDropdown)}
            className="select-none"
          >
            Category
          </span>

          {openDropdown && (
            <div className="absolute flex flex-col bg-white text-black mt-2 p-3 rounded shadow-xl min-w-40 z-50">
              {categories.length === 0 ? (
                <span className="text-gray-700">No Categories</span>
              ) : (
                categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    onClick={() => setOpenDropdown(false)}
                    className="hover:bg-gray-100 border-b border-gray-300 px-3 py-1 rounded text-black"
                  >
                    {cat.name}
                  </Link>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/about">About Us</Link>
        <Link to="/contact">Contact</Link>

        {/* LOGIN / LOGOUT */}
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-white text-black px-3 py-1 rounded">
            Login
          </Link>
        )}

        {/* CART (DESKTOP) */}
        <Link to="/cart" className="relative">
          <ShoppingCart size={26} />
          {totalQty > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {totalQty}
            </span>
          )}
        </Link>
      </div>

      {/* ---------- MOBILE MENU PANEL ---------- */}
      {mobileMenu && (
        <div className="absolute top-16 left-0 w-full bg-black text-white flex flex-col gap-5 p-5 md:hidden">
          <Link to="/" onClick={() => setMobileMenu(false)}>
            Home
          </Link>
          <Link to="/shop" onClick={() => setMobileMenu(false)}>
            Shop
          </Link>
          <Link to="/my-orders" onClick={() => setMobileMenu(false)}>
            Orders
          </Link>

          {/* MOBILE CATEGORY DROPDOWN */}
          {/* <div>
            <p
              className="font-semibold"
              onClick={() => setOpenDropdown(!openDropdown)}
            >
              Categories ↓
            </p>

            {openDropdown && (
              <div className="ml-3 mt-2 flex flex-col gap-1 bg-white text-black p-2 rounded">
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    to={`/category/${cat.slug}`}
                    onClick={() => {
                      setMobileMenu(false);
                      setOpenDropdown(false);
                    }}
                    className="hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div> */}

          <Link to="/about" onClick={() => setMobileMenu(false)}>
            About Us
          </Link>
          <Link to="/contact" onClick={() => setMobileMenu(false)}>
            Contact
          </Link>

          {/* LOGIN / LOGOUT */}
          {token ? (
            <button
              onClick={() => {
                handleLogout();
                setMobileMenu(false);
              }}
              className="bg-red-600 px-3 py-1 rounded w-24"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenu(false)}
              className="bg-white text-black px-3 py-1 rounded w-24"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
