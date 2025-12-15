import { Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/userSlice";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const AdminLayout = () => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false); // mobile sidebar

  return (
    <div className="flex  h-screen bg-gray-100 pt-16">

      {/* ---------------- MOBILE TOP BAR ---------------- */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-black text-white flex justify-between items-center px-4 py-3 z-50">
        <h1 className="text-xl font-bold">Sabriaz Admin</h1>

        <button onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`
          fixed md:static pt-10 top-0 left-0 h-full w-64 bg-black text-white p-4 flex flex-col z-40
          transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Sidebar Title */}
        <h1 className="text-2xl font-bold mb-6 hidden md:block">
          Sabriaz Admin
        </h1>

        {/* NAV LINKS */}
        <nav className="space-y-4 mt-10 md:mt-0">
          <Link className="block hover:text-gray-300" to="/admin">Dashboard</Link>
          <Link className="block hover:text-gray-300" to="/admin/products">Products</Link>
          <Link className="block hover:text-gray-300" to="/admin/categories">Categories</Link>
          <Link className="block hover:text-gray-300" to="/admin/orders">Orders</Link>
          <Link className="block hover:text-gray-300" to="/admin/users">Users</Link>
          <Link className="block hover:text-gray-300" to="/admin/settings">Home Banner</Link>
          <Link className="block hover:text-gray-300" to="/admin/category-showcase">Category Showcase</Link>
          <Link className="block hover:text-gray-300" to="/admin/about">About Us</Link>
          <Link className="block hover:text-gray-300" to="/admin/testers">Add Testers</Link>
          <Link className="block hover:text-gray-300" to="/admin/payments">Check Payment proofs</Link>
          <Link className="block hover:text-gray-300 bg-yellow-600 py-2 text-center" to="/">Go to view website</Link>
        </nav>

        <button 
          onClick={() => dispatch(logout())}
          className="mt-auto bg-red-600 py-2 rounded text-white hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 p-6 overflow-y-auto md:ml-0">
        <Outlet />
      </main>

      {/* BACKDROP for mobile */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 md:hidden"
        />
      )}
    </div>
  );
};

export default AdminLayout;
