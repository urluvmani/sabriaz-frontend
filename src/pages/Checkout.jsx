// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Checkout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const testers = location.state?.testers || [];

  const { cartItems, totalAmount } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.user); // logged in token (if any)

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });

  const [notes, setNotes] = useState("");

  // ⭐ Pay Now ke liye extra states
  const [showPayNow, setShowPayNow] = useState(false);
  const [payMethod, setPayMethod] = useState("jazzcash"); // 'jazzcash' or 'bank_transfer'
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const validateCustomer = () => {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city
    ) {
      alert("Please fill all fields");
      return false;
    }
    return true;
  };

  // ------------------ COMMON ORDER BODY BANANA ------------------
  const buildBaseOrderPayload = () => {
    return {
      customerInfo: customer,
      items: cartItems.map((item) => ({
        productId: item._id, // ⭐ backend expects productId
        quantity: item.quantity,
      })),
      testers,
      notes,
      subtotal: totalAmount,
      discountTotal: 0,
      total: totalAmount,
    };
  };

  // ------------------ COD ORDER ------------------
  const placeOrderCOD = async () => {
    if (!validateCustomer()) return;

    const orderData = {
      ...buildBaseOrderPayload(),
      paymentMethod: "cod",
      paymentProofUrl: null,
    };

    try {
      const res = await axios.post(
        "https://sabriaz-backend.onrender.com/api/orders",
        orderData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const order = res.data;

      // Guest users ke orders localStorage me bhi store
      if (!token) {
        let guestOrders =
          JSON.parse(localStorage.getItem("guest_orders")) || [];
        guestOrders.push(order._id);
        localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
      }

      // Clear cart
      dispatch({ type: "cart/clearCart" });

      alert("Order placed successfully (Cash on Delivery)!");
      navigate("/my-orders");
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Error placing order");
    }
  };

  // ------------------ CLOUDINARY UPLOAD FOR PAYMENT PROOF ------------------
  const uploadPaymentProofToCloudinary = async (file) => {
    if (!file) return null;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "muzammil"); // ⭐ same as products
    data.append("cloud_name", "dp7dkey9e");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dp7dkey9e/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    if (result.secure_url) return result.secure_url;

    console.log("Cloudinary error: ", result);
    throw new Error("Failed to upload screenshot");
  };

  // ------------------ PAY NOW (JAZZCASH / BANK) ------------------
  const placeOrderWithPaymentProof = async () => {
    if (!validateCustomer()) return;

    if (!proofFile) {
      alert("Please upload your payment screenshot.");
      return;
    }

    try {
      setUploading(true);
      const proofUrl = await uploadPaymentProofToCloudinary(proofFile);
      setUploading(false);

      const orderData = {
        ...buildBaseOrderPayload(),
        paymentMethod: payMethod, // 'jazzcash' or 'bank_transfer'
        paymentProofUrl: proofUrl,
      };

      const res = await axios.post(
        "https://sabriaz-backend.onrender.com/api/orders",
        orderData,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      const order = res.data;

      if (!token) {
        let guestOrders =
          JSON.parse(localStorage.getItem("guest_orders")) || [];
        guestOrders.push(order._id);
        localStorage.setItem("guest_orders", JSON.stringify(guestOrders));
      }

      dispatch({ type: "cart/clearCart" });

      alert("Payment proof submitted, we will verify and confirm your order!");
      navigate("/my-orders");
    } catch (err) {
      setUploading(false);
      console.log("ERROR:", err.response?.data);
      alert(err.response?.data?.message || "Error placing paid order");
    }
  };

  // ------------------ JSX ------------------
  return (
    <div className="p-8 pt-24 min-h-screen bg-gray-50 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Checkout</h1>

      <p className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-6 text-sm">
        <strong>Payment Options:</strong>
        <br />
        1) Cash on Delivery
        <br />
        2) Pay Now via JazzCash or Meezan Bank (upload screenshot)
      </p>

      {/* CUSTOMER INFO */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

        <input
          name="name"
          placeholder="Full Name"
          className="w-full p-2 border rounded mb-3"
          value={customer.name}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone Number"
          className="w-full p-2 border rounded mb-3"
          value={customer.phone}
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Full Address"
          className="w-full p-2 border rounded mb-3"
          rows="2"
          value={customer.address}
          onChange={handleChange}
        />

        <input
          name="city"
          placeholder="City"
          className="w-full p-2 border rounded mb-3"
          value={customer.city}
          onChange={handleChange}
        />

        <textarea
          placeholder="Order notes (optional)"
          className="w-full p-2 border rounded"
          rows="3"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* TESTERS PREVIEW */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold text-lg">Selected Testers:</h2>
        <p className="mt-1 text-gray-700 text-sm">
          {testers.length ? testers.join(", ") : "No testers selected"}
        </p>
      </div>

      {/* ORDER SUMMARY + PAYMENT OPTIONS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold text-xl mb-3">Order Summary</h2>

        <p className="flex justify-between text-lg mb-4">
          <span>Total:</span>
          <span>Rs {totalAmount}</span>
        </p>

        {/* COD BUTTON */}
        <button
          onClick={placeOrderCOD}
          className="w-full mb-3 bg-black text-white py-3 rounded hover:opacity-90"
        >
          Place Order (Cash on Delivery)
        </button>

        {/* PAY NOW TOGGLE */}
        <button
          type="button"
          onClick={() => setShowPayNow((prev) => !prev)}
          className="w-full mb-3 bg-indigo-600 text-white py-3 rounded hover:opacity-90"
        >
          {showPayNow
            ? "Hide Pay Now Options"
            : "Pay Now (JazzCash / Bank Transfer)"}
        </button>

        {showPayNow && (
          <div className="mt-4 border-t pt-4 space-y-3 text-sm">
            {/* PAYMENT METHOD CHOICE */}
            <div>
              <p className="font-semibold mb-1">Choose Payment Method:</p>
              <label className="flex items-center gap-2 mb-1">
                <input
                  type="radio"
                  value="jazzcash"
                  checked={payMethod === "jazzcash"}
                  onChange={() => setPayMethod("jazzcash")}
                />
                <span>JazzCash (Mobile Number)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="bank_transfer"
                  checked={payMethod === "bank_transfer"}
                  onChange={() => setPayMethod("bank_transfer")}
                />
                <span>Meezan Bank Transfer</span>
              </label>
            </div>

            {/* SHOW DETAILS ACCORDING TO METHOD */}
            {payMethod === "jazzcash" ? (
              <div className="bg-gray-50 p-3 rounded border">
                <p className="font-semibold mb-1">JazzCash Details:</p>
                <p>
                  Account Name: <strong>Muzammil</strong>
                </p>
                <p>
                  Mobile Number: <strong>0300-9650031</strong>
                </p>
                <p className="mt-2">
                  Please send <strong>Rs {totalAmount}</strong> to this JazzCash
                  number and upload the payment screenshot below.
                </p>
              </div>
            ) : (
              <div className="bg-gray-50 p-3 rounded border">
                <p className="font-semibold mb-1">Meezan Bank Details:</p>
                <p>
                  Account Title: <strong>Imran Mehmood</strong>
                </p>
                <p>
                  Account Number: <strong>04020100445811</strong>
                </p>
                <p>
                  Bank: <strong>Meezan Bank</strong>
                </p>
                <p className="mt-2">
                  Please send <strong>Rs {totalAmount}</strong> via bank
                  transfer and upload the payment screenshot below.
                </p>
              </div>
            )}

            {/* SCREENSHOT UPLOAD */}
            <div>
              <p className="font-semibold mb-1 mt-2">
                Upload Payment Screenshot:
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setProofFile(file || null);
                  setProofPreview(file ? URL.createObjectURL(file) : "");
                }}
                className="border p-2 rounded w-full"
              />
              {proofPreview && (
                <img
                  src={proofPreview}
                  alt="Payment proof preview"
                  className="w-32 h-32 object-cover rounded mt-2 border"
                />
              )}
            </div>

            <button
              onClick={placeOrderWithPaymentProof}
              disabled={uploading}
              className="w-full bg-green-600 text-white py-3 rounded mt-2 hover:opacity-90 disabled:opacity-60"
            >
              {uploading
                ? "Uploading & Placing Order..."
                : "Submit Payment & Place Order"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
