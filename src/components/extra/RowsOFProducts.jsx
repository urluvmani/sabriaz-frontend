import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const RowsOFProducts = () => {
  const [products, setProducts] = useState([]);
  const [displayed, setDisplayed] = useState([]);

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

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/products"
      );

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const calcDiscountedPrice = (p) => {
    if (!p.discountPercent || p.discountPercent <= 0) return p.price;
    const disc = p.price - (p.price * p.discountPercent) / 100;
    return Math.round(disc);
  };

  return (
    <div className="w-full px-2 md:px-10">
      {/* RESPONSIVE GRID */}
      <div
        className="
          grid 
          grid-cols-2 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4 
          gap-4
        "
      >
        {displayed.slice(0, 8).map((p) => {
          const hasDiscount = p.discountPercent > 0;
          const finalPrice = calcDiscountedPrice(p);

          return (
            <Link
              to={`/product/${p._id}`}
              key={p._id}
              className="
                product 
                bg-white 
                p-2 
                rounded-md 
                shadow-sm 
                hover:shadow-md 
                transition 
                cursor-pointer 
                overflow-hidden 
                flex 
                flex-col
              "
            >
              {/* IMAGE */}
              <div className="relative w-full h-56 sm:h-60 md:h-64 overflow-hidden rounded">
                <img
                  className="
                    w-full h-full 
                    object-cover 
                    transform 
                    transition 
                    duration-300 
                    group-hover:scale-105
                  "
                  src={p.images?.[0] || "noimg.webp"}
                  alt={p.name}
                />

                {hasDiscount && (
                  <span className="absolute top-2 left-2 bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                    -{p.discountPercent}%
                  </span>
                )}
              </div>

              {/* TITLE + STARS */}
              <div className="flex justify-between items-center mt-2">
                <h2 className="text-md sm:text-lg font-semibold">{p.name}</h2>
                <Stars rating={p.avgRating || 0} />
              </div>

              {/* DESCRIPTION */}
              <p className="text-xs sm:text-sm font-extralight line-clamp-2 my-1">
                {p.description?.substring(0, 100)}...
              </p>

              {/* PRICE */}
              <div className="flex gap-3 items-center mt-2">
                <span className="text-lg font-bold">Rs.{finalPrice}</span>
                {hasDiscount && (
                  <span className="text-sm line-through text-gray-400">
                    Rs.{p.price}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RowsOFProducts;
