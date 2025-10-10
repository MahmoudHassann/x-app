import React, { useState } from "react";
import { Link } from "react-router-dom";

const Product = ({ product }) => {
  const productUrl = `/product/${product.product_id}`;
  const baseImageUrl = "https://mister-x-store.com/mister_x_site/public/imgs/";
 
  const prices = product.colors.flatMap((color) =>
    color.sizes.map((size) => size.price)
  );
  const [currentColor, setCurrentColor] = useState("");
  const handleColorHover = (panel) => {
    console.log(panel, "panel");
    setCurrentColor(panel);
  };

  const getColorImage = (color) => {
    console.log(color, "color");
    // const colorInfo = product.colorPanel.find((panel) => panel.color === color);
    return color
      ? `${baseImageUrl}${color.main_img}`
      : `${baseImageUrl}${color.hover_img}`;
  };
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : null;
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
      <div className="product">
        <div className="status-badges">
          {product.Bestsellers && (
            <span className="best-seller">Best seller</span>
          )}
          {product.Sale && <span className="sale">Sale</span>}
        </div>
       <Link to={`/shop${productUrl}`}>
          <img
            src={`${baseImageUrl}${product.product_img}`}
            alt={`${product.product_name}`}
            className="main-image"
          />
          <img
            src={`${baseImageUrl}${product.product_hover_img}`}
            alt={`${product.product_name}`}
            className="hover-image"
          />
          {currentColor && (
            <img
              src={getColorImage(currentColor)}
              alt={product.product_name}
              className="hover-image"
            />
          )}
        </Link>
        <div className="about-product">
          {product.New && <div className="status">NEW</div>}

          <div className="info">
            <div className="top-info">
              <div className="name">{product.product_name}</div>
              <div className="price">
                {minPrice !== null && maxPrice !== null
                  ? `${minPrice} - ${maxPrice} EGP`
                  : "Not Found"}
              </div>
            </div>

            <div className="colors">
              <div className="list-colors">
                {product.colors.map((panel, index) => (
                  <li
                    key={index}
                    onMouseEnter={() => handleColorHover(panel)}
                    onMouseLeave={() => handleColorHover("")}
                  >
                    <Link to="#" className={`color-thumbnail`}>
                      <img
                        src={`${baseImageUrl}${panel.thumbnail}`}
                        alt={panel.color_name}
                        className="color-image"
                      />
                    </Link>
                  </li>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Product;
