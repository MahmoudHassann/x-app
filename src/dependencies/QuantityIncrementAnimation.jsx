import React, { useEffect, useState } from "react";
import "../sass/components/_quantityIncrement.scss";
const QuantityIncrementAnimation = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timeout = setTimeout(() => {
      setAnimate(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={`quantity-increment ${animate ? "show" : ""}`}>
      <span>+1</span>
    </div>
  );
};

export default QuantityIncrementAnimation;
