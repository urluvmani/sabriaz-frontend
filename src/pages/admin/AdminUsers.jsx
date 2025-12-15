import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminUsers = () => {
  const { token } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/users",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 md:p-8 w-full">
      <h1 className="text-3xl font-bold mb-6">Registered Users</h1>

      {/* Responsive Wrapper */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="min-w-[700px] w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Joined On</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b">
                <td className="p-3">{u.name}</td>
                <td className="p-3 break-all">{u.email}</td>
                <td className="p-3 capitalize">{u.role}</td>
                <td className="p-3">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
