import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const token = localStorage.getItem("sabriaz_token");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (token) {
          const res = await axios.get(
            "https://sabriaz-backend.onrender.com/api/orders/my",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setOrders(res.data);
        } else {
          const guestOrderIds =
            JSON.parse(localStorage.getItem("guest_orders")) || [];
          if (guestOrderIds.length === 0) return setOrders([]);

          const res = await axios.post(
            "https://sabriaz-backend.onrender.com/api/orders/guest",
            {
              ids: guestOrderIds,
            }
          );

          setOrders(res.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrders();
  }, [token]);
  const cancelOrder = async (id) => {
    if (!window.confirm("Kya aap order cancel karna chahte ho?")) return;

    try {
      await axios.patch(
        `https://sabriaz-backend.onrender.com/api/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // local state update
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "cancelled" } : o))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div className="p-4  sm:p-8  min-h-screen bg-gray-50 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 pt-20 text-center">My Orders</h1>

      {/* ----------------- NO ORDERS ----------------- */}
      {orders.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <p className="text-lg font-medium mb-4">No orders found.</p>
          <Link
            to="/shop"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg shadow hover:bg-gray-900 transition"
          >
            Go to Buy
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white rounded-lg shadow p-6 border border-gray-100 hover:shadow-md transition"
            >
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-bold">
                  Order #{o._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-gray-500 text-sm mt-1 sm:mt-0">
                  {new Date(o.createdAt).toLocaleString()}
                </p>
              </div>

              {/* STATUS + TOTAL */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <p className="text-lg font-semibold">
                  Total: <span className="text-black">Rs {o.total}</span>
                </p>

                <p className="text-gray-700">
                  Status:{" "}
                  <span className="font-bold capitalize">{o.status}</span>
                </p>
              </div>

              {/* TESTERS */}
              {o.testers?.length > 0 && (
                <p className="mt-3 text-sm text-gray-700">
                  <strong>Testers:</strong> {o.testers.join(", ")}
                </p>
              )}

              {/* NOTES */}
              {o.notes && (
                <p className="mt-1 text-sm text-gray-800">
                  <strong>Notes:</strong> {o.notes}
                </p>
              )}

              {/* ITEMS */}
              <div className="mt-4">
                <h3 className="font-semibold text-lg mb-1">Items:</h3>
                <ul className="list-disc ml-5 text-gray-800">
                  {o.items.map((it, idx) => (
                    <li key={idx}>
                      {it.name} — Qty: {it.quantity}
                    </li>
                  ))}
                </ul>
              </div>
              {o.status !== "cancelled" &&
                o.status !== "shipped" &&
                o.status !== "completed" && (
                  <button
                    onClick={() => cancelOrder(o._id)}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Cancel Order
                  </button>
                )}

              {/* Divider */}
              <div className="mt-5 border-t pt-3 text-sm text-gray-500">
                Order ID: {o._id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
