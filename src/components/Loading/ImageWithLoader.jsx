import React, { useState } from "react";
import ContentLoader from "react-content-loader";

const ImageWithLoader = ({
  src,
  alt,
  className,
  isZoomed,
  handleMouseMove,
  handleClick,
}) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoad = () => {
    setLoading(false);
  };

  return (
    <>
      {loading && (
        <ContentLoader
          speed={2}
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          backgroundColor={"#333"}
          foregroundColor={"#999"}
        >
          <rect x="0" y="0" width="100" height="100" />
        </ContentLoader>
      )}
      <img
        src={src}
        alt={alt}
        className={`main-image ${isZoomed ? "zoomed" : ""} ${className}`}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onLoad={handleImageLoad}
      />
    </>
  );
};

export default ImageWithLoader;
