import React, { useEffect, useState } from "react";
import Product from "../Shop/Product";

export const saveRecentlyViewed = (product) => {
  const recentlyViewed =
    JSON.parse(localStorage.getItem("recentlyViewed")) || [];
  if (!recentlyViewed.some((item) => item.id === product.id)) {
    recentlyViewed.push(product);

    if (recentlyViewed.length > 5) {
      recentlyViewed.shift();
    }

    localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
  }
};

const RecentlyViewed = () => {
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
    setRecentlyViewed(viewed);
  }, []);

  const [currentColor, setCurrentColor] = useState("");
  const handleColorHover = (color) => {
    setCurrentColor(color);
  };

  return (
    <section className="products_wrapper">
      <div className="products">
        <div className="container-fluid ">
          <div className="special-head pb-2 ">
            <h2>Recently Viewed</h2>
          </div>
          <div className="row">
            {recentlyViewed.map((product, index) => (
              <Product key={index} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
