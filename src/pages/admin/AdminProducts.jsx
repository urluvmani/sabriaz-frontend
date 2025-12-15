import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../redux/productsSlice";

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.user);

  const [categories, setCategories] = useState([]);

  // MULTI IMAGES
  const [imageFiles, setImageFiles] = useState([]);

  const [formMode, setFormMode] = useState("add");
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPercent: "",
    stock: "",
    category: "",
  });

  // ---------------- FETCH PRODUCTS ----------------
  const fetchProducts = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/products"
    );
    dispatch(setProducts(res.data));
  };

  // ---------------- FETCH CATEGORIES ----------------
  const fetchCategories = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/categories"
    );
    setCategories(res.data);
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // ---------------- FORM CHANGE ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      discountPercent: "",
      stock: "",
      category: "",
      isFeatured: false,
    });
    setImageFiles([]);
  };

  // ---------------- MULTIPLE CLOUDINARY UPLOAD ----------------
  const uploadImagesToCloudinary = async () => {
    if (!imageFiles.length) return [];

    const uploadedUrls = [];

    for (let file of imageFiles) {
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

      const uploadRes = await res.json();
      uploadedUrls.push(uploadRes.secure_url);
    }

    return uploadedUrls;
  };

  // ---------------- ADD PRODUCT ----------------
  const handleAdd = async () => {
    let imageUrls = [];

    if (imageFiles.length) {
      imageUrls = await uploadImagesToCloudinary();
    }

    const body = {
      ...form,
      images: imageUrls,
    };

    const res = await axios.post(
      "https://sabriaz-backend.onrender.com/api/products",
      body,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    dispatch(addProduct(res.data));
    resetForm();
  };

  // ---------------- EDIT PRODUCT ----------------
  const handleEdit = async () => {
    let uploadedNewImages = [];

    if (imageFiles.length) {
      uploadedNewImages = await uploadImagesToCloudinary();
    }

    const finalImages = [...existingImages, ...uploadedNewImages];

    const body = {
      ...form,
      images: finalImages,
    };

    const res = await axios.put(
      `https://sabriaz-backend.onrender.com/api/products/${editingProduct._id}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(updateProduct(res.data));

    setEditingProduct(null);
    resetForm();
    setFormMode("add");
    setExistingImages([]);
  };

  // ---------------- DELETE PRODUCT ----------------
  const handleDelete = async (id) => {
    await axios.delete(
      `https://sabriaz-backend.onrender.com/api/products/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    dispatch(deleteProduct(id));
  };

  const removeExistingImage = async (imgUrl) => {
    const updatedImages = existingImages.filter((img) => img !== imgUrl);

    setExistingImages(updatedImages);

    // Update DB immediately
    const res = await axios.put(
      `https://sabriaz-backend.onrender.com/api/products/${editingProduct._id}`,
      { images: updatedImages },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    dispatch(updateProduct(res.data));
  };

  // ---------------- START EDITING ----------------
  const startEditing = (product) => {
    setEditingProduct(product);
    setFormMode("edit");

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      discountPercent: product.discountPercent,
      stock: product.stock,
      category: product?.category?._id || "",
      isFeatured: product.isFeatured || false,
    });

    // Load existing images
    setExistingImages(product.images || []);
  };

  return (
    <div className="py-8 ">
      <h1 className="text-3xl font-bold mb-6">Admin Products</h1>

      {/* FORM */}
      <div className="bg-white overflow-hidden  p-6 rounded shadow-md mb-8 w-[95vw] md:max-w-lg">
        <h2 className="text-xl font-semibold mb-4">
          {formMode === "add" ? "Add New Product" : "Edit Product"}
        </h2>

        <div className="grid gap-3">
          {/* MULTI IMAGE UPLOAD */}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImageFiles(Array.from(e.target.files))}
            className="border p-2 rounded"
          />

          {/* PREVIEW */}
          {imageFiles.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imageFiles.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  className="w-16 h-16 object-cover rounded"
                />
              ))}
            </div>
          )}
          {existingImages.length > 0 && (
            <div>
              <p className="font-semibold mb-2">Existing Images:</p>
              <div className="flex gap-2 flex-wrap">
                {existingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      className="w-20 h-20 object-cover rounded border"
                    />

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => removeExistingImage(img)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white text-xs p-1 rounded-full"
                    >
                      ❌
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            className="border p-2 rounded"
            value={form.name}
            onChange={handleChange}
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Description"
            className="border p-2 rounded"
            value={form.description}
            onChange={handleChange}
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            className="border p-2 rounded"
            value={form.price}
            onChange={handleChange}
          />

          {/* DISCOUNT */}
          <input
            type="number"
            name="discountPercent"
            placeholder="Discount %"
            className="border p-2 rounded"
            value={form.discountPercent}
            onChange={handleChange}
          />

          {/* STOCK */}
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            className="border p-2 rounded"
            value={form.stock}
            onChange={handleChange}
          />
          {/* FEATURED CHECKBOX */}
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
            />
            <span className="text-sm font-medium">
              Mark as Featured Product
            </span>
          </label>

          {/* CATEGORY DROPDOWN */}
          <select
            name="category"
            className="border p-2 rounded"
            value={form.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUBMIT BUTTON */}
          {formMode === "add" ? (
            <button
              onClick={handleAdd}
              className="bg-black text-white py-2 rounded hover:opacity-80"
            >
              Add Product
            </button>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white py-2 rounded hover:opacity-80"
            >
              Update Product
            </button>
          )}
        </div>
      </div>

      <div className="w-[88vw] md:w-[75vw] h-auto  overflow-x-scroll  md:overflow-x-hidden rounded shadow-md">
        {/* PRODUCTS TABLE */}
        <table className="md:w-full w-screen  shadow-md rounded overflow-y-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Featured</th>

              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products?.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="p-3">
                  <img
                    src={p.images[0]}
                    className="w-14 h-14 object-cover rounded"
                  />
                </td>
                <td className="p-3">{p.name}</td>
                <td className="p-3">Rs {p.price}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">
                  {p.isFeatured ? (
                    <span className="text-green-600 font-bold">Yes</span>
                  ) : (
                    <span className="text-gray-400">No</span>
                  )}
                </td>

                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => startEditing(p)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
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

export default AdminProducts;
