import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminShowcaseCategories = () => {
  const { token } = useSelector((state) => state.user);

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);

  const [formMode, setFormMode] = useState("add");
  const [editId, setEditId] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    displayName: "",
    image: "",
    category: "",
  });

  // Fetch categories & showcase items
  const fetchData = async () => {
    const cats = await axios.get(
      "https://sabriaz-backend.onrender.com/api/categories"
    );
    setCategories(cats.data);

    const sc = await axios.get(
      "https://sabriaz-backend.onrender.com/api/showcase-categories"
    );
    setItems(sc.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setForm({ displayName: "", image: "", category: "" });
    setEditId(null);
    setFormMode("add");
  };

  // Cloudinary Upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", "muzammil");
      data.append("cloud_name", "dp7dkey9e");

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dp7dkey9e/image/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const uploaded = await res.json();
      if (uploaded.secure_url) {
        setForm({ ...form, image: uploaded.secure_url });
      } else {
        alert("Image upload failed");
      }
    } catch (err) {
      alert("Image upload error!");
    }
    setUploading(false);
  };

  const submitForm = async () => {
    if (!form.image) {
      alert("Please upload an image");
      return;
    }

    const config = { headers: { Authorization: `Bearer ${token}` } };

    if (formMode === "edit") {
      await axios.put(
        `https://sabriaz-backend.onrender.com/api/showcase-categories/${editId}`,
        form,
        config
      );
    } else {
      await axios.post(
        "https://sabriaz-backend.onrender.com/api/showcase-categories",
        form,
        config
      );
    }

    resetForm();
    fetchData();
  };

  const deleteItem = async (id) => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    await axios.delete(
      `https://sabriaz-backend.onrender.com/api/showcase-categories/${id}`,
      config
    );
    fetchData();
  };

  const startEditing = (item) => {
    setForm({
      displayName: item.displayName,
      image: item.image,
      category: item.category._id,
    });
    setEditId(item._id);
    setFormMode("edit");
  };

  return (
    <div className="p-4 overflow-hidden md:p-8">
      <h1 className="text-3xl font-bold mb-6">Showcase Categories</h1>

      {/* FORM */}
      <div className="bg-white p-6 rounded shadow-md max-w-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {formMode === "add"
            ? "Add Showcase Category"
            : "Edit Showcase Category"}
        </h2>

        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Display Name"
            className="border p-2 rounded"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
          />

          <label className="font-semibold">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border p-2 rounded"
          />

          {uploading && <p className="text-blue-500">Uploading...</p>}

          {form.image && (
            <img
              src={form.image}
              className="w-24 h-24 rounded-full object-cover border"
            />
          )}

          <select
            className="border p-2 rounded"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={submitForm}
            className={`py-2 rounded text-white ${
              formMode === "add" ? "bg-black" : "bg-blue-600"
            }`}
          >
            {formMode === "add" ? "Add Category" : "Update Category"}
          </button>

          {formMode === "edit" && (
            <button
              onClick={resetForm}
              className="py-2 rounded bg-gray-400 text-white"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* RESPONSIVE GRID LIST */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded text-center bg-white shadow"
          >
            <img
              src={item.image}
              className="w-24 h-24 mx-auto rounded-full object-cover"
            />

            <h3 className="uppercase mt-3 font-semibold">{item.displayName}</h3>

            <p className="text-xs text-gray-500 mt-1">
              Category: {item.category?.name}
            </p>

            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={() => startEditing(item)}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteItem(item._id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminShowcaseCategories;
