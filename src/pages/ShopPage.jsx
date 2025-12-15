import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");

  // ⭐ SEO TITLE SETTER (React 19 Compatible)
  useEffect(() => {
    document.title =
      "Sabriaz Perfume Collection – Luxury, Arabic & Long-Lasting Fragrances in Pakistan";
  }, []);

  // ⭐ SEO VISIBLE CONTENT
  const seo = {
    h1: "Premium Perfume Collection in Pakistan",
    paragraph:
      "Sabriaz aapko premium, long-lasting fragrances offer karta hai jisme men perfumes, women perfumes, Arabic perfumes aur French luxury scents shamil hain. Har perfume high projection aur long-lasting performance deta hai. Apni pasand ka signature fragrance ab Sabriaz se order karein.",
    keywords:
      "perfumes in Pakistan, Arabic perfumes, men perfumes, women perfumes, long lasting fragrances, luxury perfumes",
  };

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

  // -------- FETCH PRODUCTS ----------
  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/products"
      );

      // Fetch rating for each product
      const productsWithRatings = await Promise.all(
        res.data.map(async (p) => {
          const rating = await getAverageRating(p._id);
          return { ...p, avgRating: rating };
        })
      );

      setProducts(productsWithRatings);
      setDisplayed(productsWithRatings);
    } catch (err) {
      console.log("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

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

  // -------- FETCH CATEGORIES ----------
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/categories"
      );
      setCategories(res.data);
    } catch (err) {
      console.log("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  // -------- FILTER + SORT ----------
  useEffect(() => {
    let data = [...products];

    if (search.trim()) {
      const term = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    if (selectedCategory !== "all") {
      data = data.filter(
        (p) => p.category && p.category._id === selectedCategory
      );
    }

    if (sortBy === "priceLow") {
      data.sort((a, b) => a.price - b.price);
    } else if (sortBy === "priceHigh") {
      data.sort((a, b) => b.price - a.price);
    } else if (sortBy === "discount") {
      data.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
    } else if (sortBy === "nameAZ") {
      data.sort((a, b) => a.name.localeCompare(b.name));
    }

    setDisplayed(data);
  }, [products, search, selectedCategory, sortBy]);

  const calcDiscountedPrice = (p) => {
    if (!p.discountPercent || p.discountPercent <= 0) return p.price;
    const disc = p.price - (p.price * p.discountPercent) / 100;
    return Math.round(disc);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* ⭐ SEO SECTION (VISIBLE CONTENT FOR GOOGLE) */}
        {/* <div className="mb-8 flex flex-col items-center">
          <h1 className="text-3xl text-center font-bold text-black">{seo.h1}</h1>
          <p className="text-gray-700 text-center mt-2 max-w-3xl leading-relaxed">
            {seo.paragraph}
          </p>
          <p className="text-xs text-gray-400 text-center italic mt-1">
           {seo.keywords}
          </p>
        </div> */}

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-black">
              Sabriaz Collection
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Discover our complete range of luxury fragrances curated for every
              mood & moment.
            </p>
          </div>
          <div className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-black">{displayed.length}</span>{" "}
            products
          </div>
        </div>

        {/* FILTER BAR */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search perfumes, attars, gift sets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none"
            >
              <option value="default">Sort: Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="discount">Highest Discount</option>
              <option value="nameAZ">Name: A → Z</option>
            </select>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-gray-500 py-16">
            Loading products...
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && displayed.length === 0 && (
          <div className="text-center text-gray-500 py-16">
            No products found. Try adjusting filters.
          </div>
        )}

        {/* GRID */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {displayed.map((p) => {
              const hasDiscount = p.discountPercent && p.discountPercent > 0;
              const finalPrice = calcDiscountedPrice(p);

              return (
                <Link
                  to={`/product/${p._id}`}
                  key={p._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:-translate-y-1 hover:shadow-md transition-transform duration-200"
                >
                  <div className="relative h-64 bg-gray-100 overflow-hidden">
                    <img
                      src={p.images?.[0] || "noimg.webp"}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {hasDiscount && (
                      <div className="absolute top-3 left-3 bg-black/85 text-white text-xs px-2 py-1 rounded">
                        -{p.discountPercent}%
                      </div>
                    )}
                  </div>

                  <div className="p-3 flex-1 flex flex-col">
                    <div className="flex justify-between items-start gap-2">
                      <h2 className="text-base font-semibold text-black line-clamp-2">
                        {p.name}
                      </h2>

                      {p.category && (
                        <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {p.category.name}
                        </span>
                      )}
                    </div>

                    <Stars rating={p.avgRating || 0} />

                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                      {p.description}
                    </p>

                    {/* Price */}
                    <div className="mt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-black">
                          Rs. {finalPrice}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs line-through text-gray-400">
                            Rs. {p.price}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        In stock: {p.stock ?? 0}
                      </span>
                      <button className="text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-black/90 transition">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
