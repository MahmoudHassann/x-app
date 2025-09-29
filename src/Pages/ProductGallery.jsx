import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductGallery.css";
import ImageWithLoader from "../components/Loading/ImageWithLoader";

const ProductGallery = ({ images, selectedImage, onChangeMain }) => {
  const [currentImage, setCurrentImage] = useState(selectedImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    setCurrentImage(selectedImage);
  }, [selectedImage]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  const handleClick = () => setIsZoomed(!isZoomed);
  const handleMouseEnter = () => setShowCursor(true);
  const handleMouseLeave = () => setShowCursor(false);

  const handleThumbClick = (src) => {
    setCurrentImage(src);
    onChangeMain?.(src);
  };

  return (
    <div className="product-gallery">
      <div className="main-image-container">
        <img
          src={currentImage}
          alt="Product"
          className={`main-image ${isZoomed ? "zoomed" : ""}`}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
        {showCursor && (
          <div
            className="custom-cursor"
            style={{ top: cursorPosition.y, left: cursorPosition.x }}
          >
            <i className={`fa-solid ${isZoomed ? "fa-minus" : "fa-plus"}`}></i>
          </div>
        )}
      </div>

      <div className="thumbnails">
        {Array.isArray(images) &&
          images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt=""
              onClick={() => handleThumbClick(src)}
              className="thumbnail"
            />
          ))}
      </div>
    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired, // array of URLs
  selectedImage: PropTypes.string,
  onChangeMain: PropTypes.func,
};

export default ProductGallery;
