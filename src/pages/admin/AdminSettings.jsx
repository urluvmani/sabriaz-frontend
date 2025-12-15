import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const AdminSettings = () => {
  const { token } = useSelector((state) => state.user);

  // NEW FIELD IN STATE
  const [settings, setSettings] = useState({
    homeBannerImage: "",
    homeBannerTitle: "",
    homeBannerSubtitle: "",
    globalOfferText: "",
    homeBannerLink: "", // ⭐ NEW
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH SETTINGS ----------------
  const fetchSettings = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/settings"
    );
    if (res.data) {
      setSettings(res.data);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  // ---------------- CLOUDINARY UPLOAD ----------------
  const uploadToCloudinary = async () => {
    if (!imageFile) return settings.homeBannerImage;

    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", "muzammil"); // <--- your preset
    data.append("cloud_name", "dp7dkey9e");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dp7dkey9e/image/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const uploaded = await res.json();
    return uploaded.secure_url;
  };

  // ---------------- SAVE SETTINGS ----------------
  const handleSave = async () => {
    setLoading(true);

    let bannerURL = await uploadToCloudinary();

    const body = {
      ...settings,
      homeBannerImage: bannerURL,
    };

    await axios.put("https://sabriaz-backend.onrender.com/api/settings", body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLoading(false);
    alert("Settings Updated!");
  };

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Banner Settings</h1>

      <div className="bg-white p-6 rounded shadow-md space-y-4">
        {/* Banner Image */}
        <label className="font-semibold">Home Banner Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files[0])}
          className="border p-2 rounded w-full"
        />

        {settings.homeBannerImage && (
          <img
            src={settings.homeBannerImage}
            alt="banner"
            className="w-full h-40 object-cover rounded"
          />
        )}

        {/* Banner Title */}
        <label className="font-semibold">Banner Title</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={settings.homeBannerTitle}
          onChange={(e) =>
            setSettings({ ...settings, homeBannerTitle: e.target.value })
          }
        />

        {/* Banner Subtitle */}
        <label className="font-semibold">Banner Subtitle</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={settings.homeBannerSubtitle}
          onChange={(e) =>
            setSettings({ ...settings, homeBannerSubtitle: e.target.value })
          }
        />

        {/* Global Offer */}
        <label className="font-semibold">Global Offer Text</label>
        <input
          type="text"
          className="border p-2 rounded w-full"
          value={settings.globalOfferText}
          onChange={(e) =>
            setSettings({ ...settings, globalOfferText: e.target.value })
          }
        />
        {/* Banner Button Link */}
        <label className="font-semibold">Banner Button Link (Optional)</label>
        <input
          type="text"
          placeholder="https://yourwebsite.com/product/123"
          className="border p-2 rounded w-full"
          value={settings.homeBannerLink}
          onChange={(e) =>
            setSettings({ ...settings, homeBannerLink: e.target.value })
          }
        />

        <button
          onClick={handleSave}
          className="mt-4 bg-black text-white px-5 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
};

export default AdminSettings;
