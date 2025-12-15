import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [related, setRelated] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleBuyNow = () => {
    dispatch(addToCart(product));
    navigate("/cart");
  };

  // ⭐ STAR COMPONENT
  const Stars = ({ rating }) => {
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={`text-xl ${
              i < rating ? "text-yellow-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  // ⭐ FETCH AVG RATING
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

  // ⭐ SUBMIT REVIEW
  const submitReview = async () => {
    if (!reviewRating || !reviewComment.trim()) {
      alert("Please provide a rating and a comment.");
      return;
    }

    try {
      await axios.post("https://sabriaz-backend.onrender.com/api/reviews", {
        productId: id,
        rating: reviewRating,
        comment: reviewComment,
        customerName: reviewName || "Anonymous",
      });

      setSuccessMsg("Thank you! Your review has been submitted.");
      setReviewName("");
      setReviewRating(0);
      setReviewComment("");
      fetchReviews();

      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.log("Error submitting review:", err);
    }
  };

  // ⭐ FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      const res = await axios.get(
        `https://sabriaz-backend.onrender.com/api/products/${id}`
      );
      setProduct(res.data);
      setMainImage(res.data.images?.[0] || "");
      fetchRelated(res.data.category?._id);
      fetchReviews();
    } catch (err) {
      console.log("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ FETCH REVIEWS
  const fetchReviews = async () => {
    try {
      const res = await axios.get(
        `https://sabriaz-backend.onrender.com/api/reviews/${id}`
      );
      setReviews(res.data);
    } catch (err) {
      console.log("Review error:", err);
    }
  };

  // ⭐ FETCH RELATED PRODUCTS
  const fetchRelated = async (catId) => {
    if (!catId) return;

    try {
      const res = await axios.get(
        "https://sabriaz-backend.onrender.com/api/products"
      );

      const filtered = res.data.filter(
        (p) => p.category?._id === catId && p._id !== id
      );

      const productsWithRatings = await Promise.all(
        filtered.map(async (p) => {
          const rating = await getAverageRating(p._id);
          return { ...p, avgRating: rating };
        })
      );

      setRelated(productsWithRatings);
    } catch (err) {
      console.log("Related error:", err);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);
  useEffect(() => {
    if (product) {
      document.title = `${product.name} – Long Lasting Perfume in Pakistan | Sabriaz`;
    }
  }, [product]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product Not Found</div>;

  // ⭐ DISCOUNT PRICE
  const discounted = product.discountPercent
    ? Math.round(
        product.price - (product.price * product.discountPercent) / 100
      )
    : product.price;

  // ⭐ AVG RATING
  const avgRating =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        )
      : 0;

  // ⭐ SEO BLOCK (Google readable)
  const seo = {
    title: `${product.name} – Long Lasting Perfume in Pakistan | Sabriaz`,
    description: `${
      product.name
    } aik premium long-lasting perfume hai jisme ${product.description?.slice(
      0,
      80
    )}... fragrance profile shaamil hai. Amazing projection & lasting – Available at best price on Sabriaz.`,
    keywords: `${product.name}, perfumes in Pakistan, Arabic perfumes, long lasting fragrances, premium perfumes, men perfumes, women perfumes`,
    h1: `${product.name} – Premium Long Lasting Perfume`,
    paragraph: `${product.name} aik high-quality fragrance hai jo strong projection aur long-lasting performance deta hai. Har occasion – daily wear, office, events – ke liye perfect choice hai.`,
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-20 px-4">
      {/* ⭐ SEO SECTION (VISIBLE TO GOOGLE) */}
      <div className="max-w-6xl mx-auto mb-10">
        <h1 className="text-3xl font-bold">{seo.h1}</h1>

        <p className="text-gray-700 mt-3 leading-relaxed max-w-3xl">
          {seo.paragraph}
        </p>

        {/* SEO Keywords Block */}
        <p className="text-xs text-gray-400 italic mt-2">{seo.keywords}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT — IMAGE GALLERY */}
        <div className="flex flex-col gap-4">
          <div className="w-full h-[450px] bg-white shadow rounded overflow-hidden flex items-center justify-center">
            <img
              src={mainImage}
              alt={product.name}
              className="h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>

          <div className="flex gap-3">
            {product.images?.map((img, i) => (
              <img
                key={i}
                src={img}
                onClick={() => setMainImage(img)}
                className={`w-20 h-20 rounded object-cover cursor-pointer border ${
                  img === mainImage ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT — PRODUCT INFO */}
        <div>
          <h2 className="text-3xl font-bold">{product.name}</h2>

          <div className="flex items-center gap-2 mt-1">
            <Stars rating={avgRating} />
            <span className="text-sm text-gray-600">
              ({reviews.length} reviews)
            </span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold">Rs. {discounted}</span>

            {product.discountPercent > 0 && (
              <>
                <span className="text-lg line-through text-gray-400">
                  Rs. {product.price}
                </span>
                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                  -{product.discountPercent}%
                </span>
              </>
            )}
          </div>

          <p className="text-green-600 mt-2 font-medium">
            {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
          </p>

          <p className="text-gray-700 mt-5 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => dispatch(addToCart(product))}
              className="bg-black text-white px-6 py-3 rounded-md hover:bg-black/90 transition"
            >
              Add to Cart
            </button>

            <button
              onClick={handleBuyNow}
              className="bg-white border border-black px-6 py-3 rounded-md hover:bg-gray-100 transition"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ---------- WRITE A REVIEW ---------- */}
      <div className="max-w-4xl mx-auto mt-16 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-bold mb-4">Write a Review</h2>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 rounded w-full"
            value={reviewName}
            onChange={(e) => setReviewName(e.target.value)}
          />

          <div className="flex items-center gap-2">
            <span className="font-medium">Your Rating:</span>

            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-2xl cursor-pointer ${
                    star <= reviewRating ? "text-yellow-500" : "text-gray-300"
                  }`}
                  onClick={() => setReviewRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Write your review..."
            className="border p-2 rounded w-full h-28"
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
          />

          <button
            onClick={submitReview}
            className="bg-black text-white px-5 py-2 rounded hover:bg-black/90 transition w-fit"
          >
            Submit Review
          </button>

          {successMsg && (
            <p className="text-green-600 font-medium">{successMsg}</p>
          )}
        </div>
      </div>

      {/* ---------- REVIEWS LIST ---------- */}
      <div className="max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-5">Customer Reviews</h2>

        {reviews.length === 0 && (
          <p className="text-gray-600">
            No reviews yet. Be the first to review!
          </p>
        )}

        <div className="flex flex-col gap-5">
          {reviews.map((r) => (
            <div
              key={r._id}
              className="bg-white p-4 rounded shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">
                  {r.customerName || "Anonymous"}
                </h3>
                <Stars rating={r.rating} />
              </div>

              <p className="text-gray-700 mt-2">{r.comment}</p>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(r.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------- RELATED PRODUCTS ---------- */}
      {related.length > 0 && (
        <div className="max-w-6xl mx-auto mt-16">
          <h2 className="text-2xl font-bold mb-5">Related Products</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {related.map((p) => (
              <Link
                to={`/product/${p._id}`}
                key={p._id}
                className="bg-white rounded shadow hover:shadow-md transition overflow-hidden"
              >
                <img src={p.images?.[0]} className="w-full h-48 object-cover" />

                <div className="p-3">
                  <h3 className="font-semibold line-clamp-1">{p.name}</h3>

                  <Stars rating={p.avgRating || 0} />

                  <div className="mt-2 flex gap-2 items-center">
                    <span className="font-bold">Rs {p.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
