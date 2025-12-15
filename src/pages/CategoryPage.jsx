import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const seoContent = {
  "mens-perfumes": {
    title:
      "Men’s Perfumes in Pakistan – Long Lasting Masculine Fragrances | Sabriaz",
    description:
      "Men’s long-lasting perfumes in Pakistan. Woody, fresh, Arabic & French fragrances for men. Best prices with premium quality. Shop now at Sabriaz.",
    keywords:
      "mens perfumes, men fragrances, Arabic perfumes for men, long lasting men perfume, premium perfumes in Pakistan",
    h1: "Men’s Long-Lasting Perfumes in Pakistan",
    paragraph:
      "Sabriaz men’s perfume collection bold, long-lasting aur premium masculine fragrances ka best range hai. Arabic, French aur fresh woody scents jo har occasion par strong impression chhortay hain.",
  },

  "ladies-perfumes": {
    title: "Women’s Perfumes in Pakistan – Elegant & Long Lasting | Sabriaz",
    description:
      "Best women perfumes in Pakistan. Floral, sweet, Arabic & French long-lasting ladies fragrances. Affordable luxury scents available at Sabriaz.",
    keywords:
      "women perfumes, ladies perfumes, floral perfume, sweet perfume, long lasting women fragrance, perfumes in Pakistan",
    h1: "Women’s Elegant & Long-Lasting Perfumes in Pakistan",
    paragraph:
      "Sabriaz ladies perfumes soft, sweet, floral aur luxury-inspired fragrances par based hain. Har perfume long-lasting performance ke sath daily wear aur special events ke liye ideal choice hai.",
  },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [catName, setCatName] = useState("");

  // ⭐ PICK SEO TEXT BASED ON SLUG
  const seo = seoContent[slug] || {
    title: "Perfumes in Pakistan – Sabriaz",
    description:
      "Shop premium long-lasting perfumes for men and women in Pakistan. Arabic, French & signature fragrances available.",
    keywords: "perfumes in Pakistan, Arabic perfumes, long lasting fragrances",
    h1: "Premium Perfumes Collection",
    paragraph:
      "Discover premium long-lasting perfumes for men and women. Arabic, French & signature fragrances available at best prices in Pakistan.",
  };

  // ⭐ STARS COMPONENT
  const Stars = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`text-yellow-500 text-sm ${
              rating >= n ? "opacity-100" : "opacity-20"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ⭐ FETCH AVERAGE RATING
  const getAverageRating = async (productId) => {
    try {
      const res = await axios.get(
        `https://sabriaz-backend.onrender.com/api/reviews/${productId}`
      );
      if (res.data.length === 0) return 0;

      const avg =
        res.data.reduce((sum, r) => sum + r.rating, 0) / res.data.length;

      return Math.round(avg);
    } catch (err) {
      console.log("Rating fetch error:", err);
      return 0;
    }
  };

  // ⭐ FETCH CATEGORY + PRODUCTS + RATINGS
  const fetchData = async () => {
    try {
      const catRes = await axios.get(
        `https://sabriaz-backend.onrender.com/api/categories/${slug}`
      );
      setCatName(catRes.data.name);

      const prodRes = await axios.get(
        `https://sabriaz-backend.onrender.com/api/products?slug=${slug}`
      );

      const productsWithRatings = await Promise.all(
        prodRes.data.map(async (p) => {
          const rating = await getAverageRating(p._id);
          return { ...p, avgRating: rating };
        })
      );

      setProducts(productsWithRatings);
    } catch (err) {
      console.log("Error loading category:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [slug]);
  useEffect(() => {
    if (seo?.title) {
      document.title = seo.title;
    }
  }, [seo]);

  return (
    <div className="pt-24 p-6">
      {/* ⭐ SEO DISPLAY SECTION (VISIBLE TO GOOGLE) */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{seo.h1}</h1>

        <p className="text-gray-600 mt-2 max-w-3xl leading-relaxed">
          {seo.paragraph}
        </p>

        {/* ⭐ Small Keyword Block for SEO Strength */}
        <p className="text-xs text-gray-500 mt-3 italic">{seo.keywords}</p>
      </div>

      {/* CATEGORY NAME */}
      <h2 className="text-xl font-semibold mb-3">
        Category: <span className="text-yellow-600">{catName}</span>
      </h2>

      {products.length === 0 ? (
        <p>No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link
              to={`/product/${p._id}`}
              key={p._id}
              className="bg-white rounded-lg shadow p-3"
            >
              <img
                src={p.images?.[0] || "noimg.webp"}
                className="w-full h-56 object-cover rounded"
                alt={p.name}
              />

              <h2 className="font-semibold mt-2">{p.name}</h2>

              {/* ⭐ Rating */}
              <Stars rating={p.avgRating || 0} />

              <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                {p.description}
              </p>

              <p className="font-bold mt-1">Rs. {p.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
