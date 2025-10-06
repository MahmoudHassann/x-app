import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import "./ProductGallery.css";

const ProductGallery = ({ images = [], selectedImage, onChangeMain }) => {
  const [currentImage, setCurrentImage] = useState(selectedImage || images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (selectedImage) {
      setCurrentImage(selectedImage);
      const index = images.findIndex((img) => img === selectedImage);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [selectedImage, images]);

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleImageClick = () => setIsZoomed(!isZoomed);

  const handleThumbClick = (src, idx) => {
    setCurrentImage(src);
    setCurrentIndex(idx);
    setIsZoomed(false);
    onChangeMain?.(src);
  };

  const handlePrev = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    handleThumbClick(images[newIndex], newIndex);
  };

  const handleNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    handleThumbClick(images[newIndex], newIndex);
  };

  const visibleThumbs = 4;
  const startIndex = Math.max(
    0,
    Math.min(currentIndex - 1, images.length - visibleThumbs)
  );

  return (
    <div className="gallery-container">
      <div className="main-image-wrapper">
        <div
          className={`main-image-container ${isZoomed ? "zoomed" : ""}`}
          onClick={handleImageClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={currentImage}
            alt="Product"
            className="main-image"
            style={
              isZoomed
                ? {
                    transform: "scale(2.5)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                  }
                : {}
            }
          />

          {!isZoomed && <div className="image-overlay"></div>}
        </div>

        <button
          onClick={handleImageClick}
          className="zoom-btn"
          aria-label="Toggle zoom"
        >
          {isZoomed ? <ZoomOut size={20} /> : <ZoomIn size={20} />}
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="nav-btn left"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="nav-btn right"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}

        <div className="image-counter-badge">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div className="thumbnails-wrapper">
          <div className="thumbnails-container">
            <div
              className="thumbnails-track"
              style={{
                transform: `translateX(-${
                  startIndex * (100 / visibleThumbs)
                }%)`,
              }}
            >
              {images.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => handleThumbClick(src, idx)}
                  className={`thumbnail-item ${
                    currentIndex === idx ? "active" : ""
                  }`}
                  style={{ width: `calc(${100 / visibleThumbs}% - 12px)` }}
                >
                  <div className="thumbnail-inner">
                    <img
                      src={src}
                      alt={`Thumbnail ${idx + 1}`}
                      className="thumbnail-img"
                    />
                    {currentIndex === idx && (
                      <div className="active-indicator"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {images.length > visibleThumbs && (
            <>
              <button
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="carousel-nav-btn left"
                aria-label="Previous thumbnails"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNext}
                disabled={startIndex >= images.length - visibleThumbs}
                className="carousel-nav-btn right"
                aria-label="Next thumbnails"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
