import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminAbout = () => {
  const { token } = useSelector((state) => state.user);

  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    description: "",
    mission: "",
    vision: "",
    image1: "",
    image2: "",
  });

  const [uploading1, setUploading1] = useState(false);
  const [uploading2, setUploading2] = useState(false);

  // ---------------- FETCH ABOUT DATA ----------------
  const fetchAbout = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/about"
    );
    if (res.data) setForm(res.data);
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  // ---------------- CLOUDINARY UPLOAD FUNCTIONS ----------------
  const uploadImage = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    field === "image1" ? setUploading1(true) : setUploading2(true);

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
      setForm({ ...form, [field]: uploaded.secure_url });
    }

    field === "image1" ? setUploading1(false) : setUploading2(false);
  };

  // ---------------- SUBMIT FORM ----------------
  const saveAbout = async () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };

    await axios.put(
      "https://sabriaz-backend.onrender.com/api/about",
      form,
      config
    );

    alert("About Us Page Updated!");
  };

  return (
    <div className="px-3 py-5 md:p-8">
      <h1 className="text-3xl font-bold mb-6">Edit About Us Page</h1>

      <div className="bg-white p-6 rounded shadow-md w-[90vw] md:max-w-2xl">
        <div className="grid gap-4">
          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Page Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input
            type="text"
            className="border p-2 rounded"
            placeholder="Subtitle"
            value={form.subtitle}
            onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
          />

          <textarea
            className="border p-2 rounded h-28"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <textarea
            className="border p-2 rounded h-20"
            placeholder="Mission"
            value={form.mission}
            onChange={(e) => setForm({ ...form, mission: e.target.value })}
          />

          <textarea
            className="border p-2 rounded h-20"
            placeholder="Vision"
            value={form.vision}
            onChange={(e) => setForm({ ...form, vision: e.target.value })}
          />

          {/* IMAGE 1 UPLOAD */}
          <label className="font-semibold">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e, "image1")}
            className="border p-2 rounded"
          />
          {uploading1 && <p className="text-blue-500">Uploading...</p>}
          {form.image1 && (
            <img
              src={form.image1}
              className="w-32 h-32 rounded object-cover border"
            />
          )}

          {/* IMAGE 2 UPLOAD */}
          <label className="font-semibold">Secondary Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => uploadImage(e, "image2")}
            className="border p-2 rounded"
          />
          {uploading2 && <p className="text-blue-500">Uploading...</p>}
          {form.image2 && (
            <img
              src={form.image2}
              className="w-32 h-32 rounded object-cover border"
            />
          )}

          <button
            onClick={saveAbout}
            className="bg-black text-white py-2 rounded mt-3"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
