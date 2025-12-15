import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CategoryShowcase = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const res = await axios.get(
      "https://sabriaz-backend.onrender.com/api/showcase-categories"
    );
    setItems(res.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div
      className="
        categoryShowcase 
        mt-20 
        md:pl-4
        pl-10
        flex justify-center md:justify-center 
        md:gap-5 
        gap-2
        h-[20vh] md:h-[40vh] 
        px-4 
        overflow-x-auto md:overflow-visible 
        scrollbar-hide
      "
    >
      {items.map((item) => (
        <Link
          key={item._id}
          to={`/category/${item.category.slug}`}
          className="
            min-w-[120px] md:w-40 
            h-[80%] 
            flex flex-col items-center
          "
        >
          <img
            className="
              object-cover 
              rounded-full 
              w-24 h-24 
              md:w-full md:h-[80%] 
              shadow-md
            "
            src={item.image}
            alt={item.displayName}
          />
          <h2 className="text-center text-xs md:text-sm uppercase mt-2 font-semibold">
            {item.displayName}
          </h2>
        </Link>
      ))}
    </div>
  );
};

export default CategoryShowcase;
