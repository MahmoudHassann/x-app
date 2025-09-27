import { Link } from "lucide-react";
import React from "react";

const Product = ({ product }) => {
  return (
    <div className="col-lg-3 col-md-6 col-sm-6 col-12">
      <div className="product">
        <div className="about-product">
          <div className="status">NEW</div>
          <div className="info">
            <div className="top-info">
              <div className="name">{product.product_name}</div>
              <div className="price">{product.stock.price} €</div>
            </div>

            <div className="colors">
              <div className="list-colors">
                {product.colors.map((panel, index) => (
                  <li
                    key={index}
                    // onMouseEnter={() => handleColorHover(panel.color_name)}
                    // onMouseLeave={() => handleColorHover("")}
                  >
                    <Link
                      to="#"
                      className={
                        `color-thumbnail`
                        // className={`color-thumbnail ${
                        //   product.main_img.color === panel.color ? "selected" : ""
                        // }`
                      }
                    >
                      <img
                        src={panel.thumbnail}
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

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { saveRecentlyViewed } from "../RecentlyViewed/RecentlyViewed";

// const Product = ({ product }) => {
//   // const productUrl = `/product/${product.id}?color=${encodeURIComponent(
//   //   product.mainImage.color
//   // )}`;
//   useEffect(() => {
//     saveRecentlyViewed(product);
//   }, [product]);

//   const [currentColor, setCurrentColor] = useState("");

//   const handleColorHover = (color) => {
//     console.log(color, "color");
//     setCurrentColor(color);
//   };

//   const getColorImage = (color) => {
//     const colorInfo = product.colors.find((panel) => panel.color_name === color);
//     return colorInfo ? colorInfo.main_img : product.hover_img;
//   };

//   return (
//     <div className="col-lg-3 col-md-6 col-sm-6 col-12">
//       <div className="product">
//         {/* <Link to={`/shop${productUrl}`}>
//           <img
//             src={product.mainImage.image}
//             alt={`${product.product_name}`}
//             className="main-image"
//           />
//           <img
//             src={product.hoverImage}
//             alt={`${product.name}`}
//             className="hover-image"
//           />
//           {currentColor && (
//             <img
//               src={getColorImage(currentColor)}
//               alt={product.name}
//               className="hover-image"
//             />
//           )}
//         </Link> */}
//         <div className="product-status"></div>
//         <div className="about-product">
//           <div className="status">NEW</div>
//           <div className="info">
//             <div className="top-info">
//               <div className="name">{product.product_name}</div>
//               {/* <div className="price">{product.price} €</div> */}
//             </div>
//             <div className="colors">
//               <div className="list-colors">
//                 {product.colors.map((panel, index) => (
//                   <li
//                     key={index}
//                     onMouseEnter={() => handleColorHover(panel.color_name)}
//                     onMouseLeave={() => handleColorHover("")}
//                   >
//                     <Link
//                       to="#"
//                       className={`color-thumbnail ${
//                         product.main_img.color === panel.color
//                           ? "selected"
//                           : ""
//                       }`}
//                     >
//                       <img
//                         src={panel.thumbnail}
//                         alt={panel.color}
//                         className="color-image"
//                       />
//                     </Link>
//                   </li>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Product;
