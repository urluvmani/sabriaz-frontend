import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AdminRoute from "./components/AdminRoute";
import Navbar from "./components/extra/Navbar";
import AdminLayout from "./layouts/AdminLayout";
import ShopPage from "./pages/ShopPage";

import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminSettings from "./pages/admin/AdminSettings";
import OrderDetails from "./pages/admin/OrderDetails";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminUsers from "./pages/admin/AdminUsers";
import CategoryPage from "./pages/CategoryPage";
import Footer from "./components/extra/Footer";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import CategoryShowcase from "./components/extra/CategoryShowcase";
import AdminShowcaseCategories from "./pages/admin/AdminShowcaseCategories";
import AdminAbout from "./pages/admin/AdminAbout";
import About from "./pages/About";
import WhatsappBox from "./components/extra/WhatsappBox";
import AdminTesters from "./pages/admin/AdminTesters";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import ScrollToTop from "./components/extra/ScrollToTop";
import AdminPayments from "./pages/admin/AdminPayments";
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<WhatsappBox />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route
            path="category-showcase"
            element={<AdminShowcaseCategories />}
          />
          <Route path="about" element={<AdminAbout />} />
          <Route path="testers" element={<AdminTesters />} />
          <Route path="payments" element={<AdminPayments />} />

          <Route path="" element={<AdminAnalytics />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
