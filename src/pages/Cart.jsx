import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} from "../redux/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalQty, totalAmount } = useSelector(
    (state) => state.cart
  );

  const [testers, setTesters] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    axios
      .get("https://sabriaz-backend.onrender.com/api/testers")
      .then((res) => setTesters(res.data))
      .catch((err) => console.log(err));
  }, []);

  const toggleSelect = (name) => {
    if (selected.includes(name)) {
      setSelected(selected.filter((t) => t !== name));
    } else {
      if (selected.length < 5) {
        setSelected([...selected, name]);
      } else {
        alert("You can select only 5 testers.");
      }
    }
  };

  // CHECKOUT → testers ko saath le kar checkout page par bhejenge
  const proceedToCheckout = () => {
    navigate("/checkout", { state: { testers: selected } });
  };

  return (
    <div className="p-8 pt-20 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center block md:gap-10 md:flex md:justify-center  md:items-center py-20">
          <div className="flex flex-col items-center justify-center py-1 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mb-6 max-w-sm">
              Looks like you haven’t added anything yet. Explore our perfumes
              and find your perfect scent.
            </p>

            <Link
              to="/shop"
              className="
      px-6 py-3 
      bg-black text-white 
      rounded-full 
      text-sm font-medium
      transition-all duration-300
      hover:bg-gray-900
      hover:scale-105
    "
            >
              Go Shopping
            </Link>
          </div>

          <div className="w-auto h-auto flex md:justify-end  justify-center items-center mt-8">
            <img
              className="w-[80vw] h-[40vh] rounded-2xl shadow-2xl md:h-[50vh] md:w-1/1 "
              src="vectorimg.png"
              alt="vectorimg"
            />
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          {/* CART ITEMS */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex gap-4 bg-white p-4 rounded shadow"
              >
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <p className="text-gray-600">Rs {item.price}</p>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => dispatch(decreaseQty(item._id))}
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.quantity}</span>

                    <button
                      className="px-2 bg-gray-200 rounded"
                      onClick={() => dispatch(increaseQty(item._id))}
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  className="text-red-600 font-bold"
                  onClick={() => dispatch(removeFromCart(item._id))}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* ⭐ TESTER SELECTION AREA */}
            <div className="bg-white p-4 rounded shadow mt-6">
              <h2 className="text-xl font-semibold mb-3">
                Choose 5 Free Testers
              </h2>

              <div className="flex flex-wrap gap-3">
                {testers.map((t) => (
                  <button
                    key={t._id}
                    onClick={() => toggleSelect(t.name)}
                    className={`px-3 py-1 rounded border ${
                      selected.includes(t.name)
                        ? "bg-black text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {t.name}
                  </button>
                ))}
              </div>

              <p className="mt-2 text-sm text-gray-600">
                Selected: {selected.join(", ")}
              </p>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="bg-white p-6 rounded shadow h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <p className="flex justify-between text-lg">
              <span>Total Items:</span>
              <span>{totalQty}</span>
            </p>

            <p className="flex justify-between text-xl font-bold mb-6">
              <span>Total Amount:</span>
              <span>Rs {totalAmount}</span>
            </p>

            <button
              className="w-full bg-black text-white py-3 rounded mb-3"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              className="w-full bg-red-600 text-white py-3 rounded"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
