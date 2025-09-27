import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProductGallery.css";
import ImageWithLoader from "../components/Loading/ImageWithLoader";

const ProductGallery = ({ images, selectedImage }) => {
  const [currentImage, setCurrentImage] = useState(selectedImage);
  const [isZoomed, setIsZoomed] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [showCursor, setShowCursor] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    e.target.style.transformOrigin = `${x}% ${y}%`;
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    setCurrentImage(selectedImage);
  }, [selectedImage]);

  const handleClick = () => {
    setIsZoomed(!isZoomed);
  };
  const handleMouseEnter = () => {
    setShowCursor(true);
  };

  const handleMouseLeave = () => {
    setShowCursor(false);
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
            style={{
              top: cursorPosition.y,
              left: cursorPosition.x,
            }}
          >
            <i className={`fa-solid ${isZoomed ? "fa-minus" : "fa-plus"}`}></i>
          </div>
        )}
      </div>
      <div className="thumbnails">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.thumbnail}
            alt=""
            onClick={() => setCurrentImage(image.large)}
            className={`thumbnail ${
              currentImage === image.large ? "selected" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      thumbnail: PropTypes.string.isRequired,
      large: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default ProductGallery;
