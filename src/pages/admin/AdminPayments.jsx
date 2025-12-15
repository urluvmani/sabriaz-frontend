// src/pages/admin/AdminPayments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminPayments = () => {
  const { token } = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchPaidOrders = async () => {
      try {
        const res = await axios.get(
          "https://sabriaz-backend.onrender.com/api/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // sirf woh jinke paas paymentProofUrl hai
        const withProof = res.data.filter((o) => o.paymentProofUrl);
        setOrders(withProof);
      } catch (err) {
        console.log(err);
      }
    };

    if (token) fetchPaidOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="p-8 pt-24">
        <p>Admin login required.</p>
      </div>
    );
  }

  return (
    <div className="p-8 pt-24 min-h-screen bg-gray-50 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Manual Payments (JazzCash / Bank)
      </h1>

      {orders.length === 0 ? (
        <p>No manual payment proofs found.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div
              key={o._id}
              className="bg-white p-6 rounded shadow flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  Order #{o._id.slice(-6).toUpperCase()}
                </h2>

                <p className="text-gray-600 text-sm">
                  Date: {new Date(o.createdAt).toLocaleString()}
                </p>

                <p className="mt-2 font-semibold">Customer:</p>
                <p>
                  {o.customerInfo?.name} — {o.customerInfo?.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {o.customerInfo?.address}, {o.customerInfo?.city}
                </p>

                <p className="mt-2 font-semibold">
                  Total: Rs {o.total} — Method:{" "}
                  <span className="uppercase">{o.paymentMethod}</span>
                </p>

                <p className="text-gray-700">
                  Status: <span className="font-bold">{o.status}</span> |
                  Payment: <span className="font-bold">{o.paymentStatus}</span>
                </p>

                {o.notes && (
                  <p className="mt-2 text-sm">
                    <strong>Customer Notes:</strong> {o.notes}
                  </p>
                )}

                <h3 className="mt-3 font-semibold">Items:</h3>
                <ul className="list-disc ml-5 text-sm">
                  {o.items.map((it) => (
                    <li key={it.product}>
                      {it.name} — Qty: {it.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Screenshot */}
              <div className="md:w-64">
                <p className="font-semibold mb-2">Payment Screenshot:</p>
                {o.paymentProofUrl ? (
                  <a
                    href={o.paymentProofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block"
                  >
                    <img
                      src={o.paymentProofUrl}
                      alt="Payment proof"
                      className="w-full h-auto object-cover rounded border"
                    />
                  </a>
                ) : (
                  <p>No screenshot</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
