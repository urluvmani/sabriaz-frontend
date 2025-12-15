import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Bar, Line, Pie, Doughnut } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

const AdminAnalytics = () => {
  const { token } = useSelector((state) => state.user);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const validOrders = orders.filter((o) => o.status !== "cancelled");

  const fetchOrders = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/orders",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  // ---------------- SUMMARY CARDS ----------------
  const totalOrders = validOrders.length;

  const totalRevenue = validOrders.reduce((acc, o) => acc + o.total, 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const paidOrders = validOrders.filter(
    (o) => o.paymentStatus === "paid"
  ).length;

  const unpaidOrders = validOrders.filter(
    (o) => o.paymentStatus === "unpaid"
  ).length;

  // ---------------- DAILY ORDERS BAR CHART ----------------
  const ordersByDate = {};

  validOrders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    ordersByDate[date] = (ordersByDate[date] || 0) + 1;
  });

  const dailyChart = {
    labels: Object.keys(ordersByDate),
    datasets: [
      {
        label: "Daily Orders",
        backgroundColor: "#2563eb",
        data: Object.values(ordersByDate),
      },
    ],
  };

  // ---------------- REVENUE LINE CHART ----------------
  const revenueByDate = {};

  validOrders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();
    revenueByDate[date] = (revenueByDate[date] || 0) + o.total;
  });

  const revenueChart = {
    labels: Object.keys(revenueByDate),
    datasets: [
      {
        label: "Revenue (PKR)",
        borderColor: "#16a34a",
        backgroundColor: "rgba(22,163,74,0.2)",
        data: Object.values(revenueByDate),
      },
    ],
  };

  // ---------------- SALES BY CITY PIE ----------------
  const salesByCity = {};

  validOrders.forEach((o) => {
    const city = o.customerInfo.city || "Unknown";
    salesByCity[city] = (salesByCity[city] || 0) + o.total;
  });

  const cityChart = {
    labels: Object.keys(salesByCity),
    datasets: [
      {
        data: Object.values(salesByCity),
        backgroundColor: [
          "#ef4444",
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#06b6d4",
        ],
      },
    ],
  };

  // ---------------- PAYMENT METHOD DOUGHNUT ----------------
  const paymentMethodCount = {};

  validOrders.forEach((o) => {
    const method = o.paymentMethod || "cod";
    paymentMethodCount[method] = (paymentMethodCount[method] || 0) + 1;
  });

  const paymentChart = {
    labels: Object.keys(paymentMethodCount),
    datasets: [
      {
        data: Object.values(paymentMethodCount),
        backgroundColor: ["#3b82f6", "#10b981", "#f97316"],
      },
    ],
  };

  // ---------------- TOP PRODUCTS ----------------
  const productSales = {};

  validOrders.forEach((o) => {
    o.items.forEach((item) => {
      productSales[item.name] = (productSales[item.name] || 0) + item.quantity;
    });
  });

  const topProducts = {
    labels: Object.keys(productSales),
    datasets: [
      {
        label: "Units Sold",
        backgroundColor: "#8b5cf6",
        data: Object.values(productSales),
      },
    ],
  };

  return (
    <div className="p-8 ">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="p-5 bg-blue-600 text-white rounded-lg shadow-md">
          <h2 className="text-lg">Total Orders</h2>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>

        <div className="p-5 bg-green-600 text-white rounded-lg shadow-md">
          <h2 className="text-lg">Revenue</h2>
          <p className="text-3xl font-bold">Rs {totalRevenue.toFixed(0)}</p>
        </div>

        <div className="p-5 bg-indigo-600 text-white rounded-lg shadow-md">
          <h2 className="text-lg">Average Order Value</h2>
          <p className="text-3xl font-bold">Rs {avgOrderValue.toFixed(0)}</p>
        </div>

        <div className="p-5 bg-red-600 text-white rounded-lg shadow-md">
          <h2 className="text-lg">Paid / Unpaid</h2>
          <p className="text-2xl font-bold">
            {paidOrders} / {unpaidOrders}
          </p>
        </div>
      </div>

      {/* DAILY ORDERS */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">Daily Orders</h2>
        <Bar data={dailyChart} />
      </div>

      {/* REVENUE LINE */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">Revenue Trend</h2>
        <Line data={revenueChart} />
      </div>

      {/* GRID FOR CITY + PAYMENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Sales by City</h2>
          <Pie data={cityChart} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>
          <Doughnut data={paymentChart} />
        </div>
      </div>

      {/* TOP PRODUCTS */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-10">
        <h2 className="text-xl font-semibold mb-4">Top Selling Products</h2>
        <Bar data={topProducts} />
      </div>
    </div>
  );
};

export default AdminAnalytics;
