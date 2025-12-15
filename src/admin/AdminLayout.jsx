import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <AdminSidebar />

      <div className="flex flex-col flex-1">
        <AdminNavbar />
        <div className="p-6 bg-gray-100 min-h-screen">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
