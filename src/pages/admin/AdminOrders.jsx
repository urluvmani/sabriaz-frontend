import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminOrders = () => {
  const { token } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [search, setSearch] = useState("");

  // ---------------- PDF Generator ----------------
  const downloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Sabriaz Perfumes", 14, 20);
    doc.setFontSize(12);
    doc.text(`Invoice #${order._id}`, 14, 30);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 14, 37);
    doc.line(14, 40, 195, 40);

    doc.setFontSize(14);
    doc.text("Customer Information", 14, 50);
    doc.setFontSize(12);
    doc.text(`Name: ${order.customerInfo.name}`, 14, 58);
    doc.text(`Phone: ${order.customerInfo.phone}`, 14, 65);
    doc.text(`Address: ${order.customerInfo.address}`, 14, 72);
    doc.line(14, 78, 195, 78);

    const tableRows = order.items.map((item) => [
      item.name,
      item.quantity,
      `Rs ${item.priceAtPurchase}`,
      `${item.discountPercentAtPurchase}%`,
      `Rs ${item.quantity * item.priceAtPurchase}`,
    ]);

    autoTable(doc, {
      startY: 85,
      head: [["Product", "Qty", "Price", "Discount", "Subtotal"]],
      body: tableRows,
    });

    let finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Order Summary", 14, finalY);

    doc.setFontSize(12);
    doc.text(`Subtotal: Rs ${order.subtotal}`, 14, finalY + 10);
    doc.text(`Discount: Rs ${order.discountTotal}`, 14, finalY + 17);
    doc.text(`Total Amount: Rs ${order.total}`, 14, finalY + 25);

    doc.setFontSize(11);
    doc.text(
      "Thank you for shopping with Sabriaz Perfumes ✨",
      14,
      finalY + 40
    );

    doc.save(`Invoice-${order._id}.pdf`);
  };

  // ---------------- Fetch Orders ----------------
  const fetchOrders = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/orders",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrders(res.data);
    setFiltered(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------- Filter Logic ----------------
  useEffect(() => {
    let data = [...orders];

    if (statusFilter) data = data.filter((o) => o.status === statusFilter);

    if (paymentFilter)
      data = data.filter((o) => o.paymentStatus === paymentFilter);

    if (search) {
      data = data.filter(
        (o) =>
          o._id.includes(search) ||
          o.customerInfo.name.toLowerCase().includes(search.toLowerCase()) ||
          o.customerInfo.phone.includes(search)
      );
    }

    setFiltered(data);
  }, [statusFilter, paymentFilter, search, orders]);

  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

      {/* FILTERS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <select
          className="border p-2 rounded"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Filter by Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          className="border p-2 rounded"
          onChange={(e) => setPaymentFilter(e.target.value)}
        >
          <option value="">Payment Status</option>
          <option value="paid">Paid</option>
          <option value="unpaid">Unpaid</option>
          <option value="refunded">Refunded</option>
        </select>

        <input
          type="text"
          placeholder="Search Order ID / Name / Phone"
          className="border p-2 rounded"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* RESPONSIVE TABLE WRAPPER */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-[880px] w-full">
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Payment</th>
              <th className="p-3">Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3 font-mono">{order._id}</td>
                <td className="p-3">{order.customerInfo.name}</td>
                <td className="p-3 font-semibold">Rs {order.total}</td>

                <td className="p-3">
                  <span className="px-2 py-1 rounded text-white text-sm bg-blue-600">
                    {order.status}
                  </span>
                </td>

                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm text-white ${
                      order.paymentStatus === "paid"
                        ? "bg-green-600"
                        : order.paymentStatus === "unpaid"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td className="p-3">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-3 flex gap-2">
                  <Link
                    to={`/admin/orders/${order._id}`}
                    className="px-3 py-1 bg-black text-white rounded"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Invoice PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
