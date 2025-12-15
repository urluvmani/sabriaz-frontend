import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminCategories = () => {
  const { token } = useSelector((state) => state.user);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);

  // -------- Fetch Categories --------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/categories"
      );
      setCategories(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // -------- Add Category --------
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Enter category name");

    try {
      await axios.post(
        "https://sabriaz-backend.onrender.com/api/categories",
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setName("");
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating category");
    }
  };

  // -------- Start Edit Mode --------
  const handleEditStart = (cat) => {
    setEditingId(cat._id);
    setName(cat.name);
  };

  // -------- Update Category --------
  const handleUpdate = async () => {
    try {
      await axios.put(
        `https://sabriaz-backend.onrender.com/api/categories/${editingId}`,
        { name },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditingId(null);
      setName("");
      fetchCategories();
    } catch (error) {
      alert("Update failed");
    }
  };

  // -------- Delete Category --------
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      await axios.delete(
        `https://sabriaz-backend.onrender.com/api/categories/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchCategories();
    } catch (error) {
      alert("Delete failed");
    }
  };

  return (
    <div className="p-y6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>

      {/* --- Add / Update Form --- */}
      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="bg-white p-4  rounded-lg shadow mb-6 flex gap-3"
      >
        <input
          type="text"
          placeholder="Category Name"
          className="border p-3 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button className="bg-black text-white px-5 rounded">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      {/* --- Categories List --- */}
      <div className="bg-white w-[95vw] md:w-[70vw] rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Slug</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id} className="border-t">
                <td className="p-3">{cat.name}</td>
                <td className="p-3 text-gray-500">{cat.slug}</td>
                <td className="p-3 flex gap-3 justify-center">
                  <button
                    onClick={() => handleEditStart(cat)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {categories.length === 0 && (
          <p className="text-center p-4 text-gray-500">No categories found</p>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
