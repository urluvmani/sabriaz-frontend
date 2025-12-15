import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderDetails = () => {
  const { id } = useParams();
  const { token } = useSelector((state) => state.user);

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [tracking, setTracking] = useState("");

  const fetchOrder = async () => {
    const res = await axios.get(
      `https://sabriaz-backend.onrender.com/api/orders`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const found = res.data.find((o) => o._id === id);
    setOrder(found);
    setStatus(found.status);
    setPaymentStatus(found.paymentStatus);
  };

  const updateStatus = async () => {
    await axios.patch(
      `https://sabriaz-backend.onrender.com/api/orders/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrder();
  };

  const updatePayment = async () => {
    await axios.patch(
      `https://sabriaz-backend.onrender.com/api/orders/${id}/payment`,
      { paymentStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrder();
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (!order) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-3">Customer Information</h2>

        <p>
          <strong>Name:</strong> {order.customerInfo.name}
        </p>
        <p>
          <strong>Phone:</strong> {order.customerInfo.phone}
        </p>
        <p>
          <strong>Email:</strong> {order.customerInfo.email || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {order.customerInfo.address}
        </p>
        <p>
          <strong>City:</strong> {order.customerInfo.city}
        </p>
        <p>
          <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <div className="bg-white p-6 rounded shadow-md mb-6">
        <table className="w-full ">
          <thead className="bg-black/80 text-white ">
            <tr className="flex w-[65vw] justify-around">
              <th className="p-2">Product</th>
              <th className="p-2">Qty</th>
              <th className="p-2">Price</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.product} className="flex w-[65vw] justify-between">
                <td className="p-2 ">{item.name}</td>
                <td className="p-2 ">{item.quantity}</td>
                <td className="p-2 ">Rs {item.priceAtPurchase}</td>
                <td className="p-2 ">
                  Rs {item.priceAtPurchase * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="text-xl mt-4">
          Total: <span className="font-bold">Rs {order.total}</span>
        </h3>
      </div>
      <h3 className="font-bold">Selected Testers:</h3>
      <ul>
        {order.testers.map((t, i) => (
          <li key={i}>• {t}</li>
        ))}
      </ul>

      {/* Update Controls */}
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-semibold mb-4">Update Order</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label>Status</label>
            <select
              className="border p-2 rounded w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button
              onClick={updateStatus}
              className="mt-2 bg-black text-white px-4 py-2 rounded"
            >
              Update Status
            </button>
          </div>

          <div>
            <label>Payment Status</label>
            <select
              className="border p-2 rounded w-full"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <button
              onClick={updatePayment}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
            >
              Update Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
