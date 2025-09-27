import React, { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import products from "../json/products";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "./ProductGallery.jsx";
import SvgPant from "../components/Shop/SvgPant.jsx";
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed.jsx";
import { addItem } from "../redux/slices/cart-slice.js";
import { notifyError, notifyWarning } from "../dependencies/Notification.js";
import QuantityIncrementAnimation from "../dependencies/QuantityIncrementAnimation";
import Resources from "../locales/Resources.json";

export default function ProductDetails() {
  const detailsRef = useRef(null);
  let dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [product, setProduct] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColorImage, setSelectedColorImage] = useState(null);
  const [lowStockMessage, setLowStockMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);
  const [selectedWaist, setSelectedWaist] = useState(null);
  const [selectedLength, setSelectedLength] = useState(null);
  const [availableLengths, setAvailableLengths] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const cartData = useSelector((state) => state.cart.cartItems);
  const [isPants, setIsPants] = useState(false);

  const isOpen = useSelector((state) => state.layout.navOpen);
  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";

  useEffect(() => {
    const foundProduct = products.find((product) => product.id === Number(id));
    if (
      foundProduct &&
      foundProduct.colorPanel &&
      foundProduct.colorPanel.length > 0
    ) {
      setProduct(foundProduct);
      setIsPants(
        foundProduct.category?.includes("Pants") ||
          foundProduct.category?.includes("jeans")
      );
      const colorFromUrl = searchParams.get("color");
      const initialColorPanel = colorFromUrl
        ? foundProduct.colorPanel.find((panel) => panel.color === colorFromUrl)
        : foundProduct.colorPanel[0];
      if (initialColorPanel) {
        const initialColor = initialColorPanel.color;
        setSelectedColor(initialColor);
        const initialImages = foundProduct.gallery[initialColor] || [];
        setGalleryImages(initialImages);
        setSelectedImage(initialImages[0]?.large || "");
        setSelectedColorImage(initialColorPanel.colorImage);
      }

      setSelectedWaist(null);
      setSelectedLength(null);
      setSelectedSize(null);
    }
  }, [id, searchParams]);

  useEffect(() => {
    if (selectedWaist && selectedColor && isPants) {
      const colorPanel = product.colorPanel.find(
        (panel) => panel.color === selectedColor
      );
      if (colorPanel?.stockBySize?.waist?.[selectedWaist]?.lengths) {
        const lengths = Object.entries(
          colorPanel.stockBySize.waist[selectedWaist].lengths
        ).map(([length, stock]) => ({
          length: parseInt(length),
          stock,
        }));
        setAvailableLengths(lengths);
      }
    }
  }, [selectedWaist, selectedColor]);

  const getAvailableWaistSizes = () => {
    if (!isPants || !selectedColor) return [];

    const colorPanel = product.colorPanel.find(
      (panel) => panel.color === selectedColor
    );

    return Object.keys(colorPanel?.stockBySize?.waist || {}).map((waist) =>
      parseInt(waist)
    );
  };

  const hasAvailableLengths = (waist) => {
    if (!selectedColor) return false;

    const colorPanel = product.colorPanel.find(
      (panel) => panel.color === selectedColor
    );

    const lengths = colorPanel?.stockBySize?.waist?.[waist]?.lengths || {};
    return Object.values(lengths).some((stock) => stock > 0);
  };

  const isLengthAvailable = (length) => {
    if (!selectedWaist || !selectedColor) return false;

    const colorPanel = product.colorPanel.find(
      (panel) => panel.color === selectedColor
    );

    return (
      (colorPanel?.stockBySize?.waist?.[selectedWaist]?.lengths?.[length] ||
        0) > 0
    );
  };

  function handleColorChange(color, image) {
    if (color === selectedColor) return;
    if (product && product.gallery && product.gallery[color]) {
      const updatedGallery = product.gallery[color] || [];
      setGalleryImages(updatedGallery);
      setSelectedColor(color);
      setSelectedImage(updatedGallery[0]?.large || "");
      setSelectedColorImage(image);
      setSelectedWaist(null);
      setSelectedLength(null);
      setSelectedSize(null);
      setLowStockMessage("");
    }
  }

  function handleWaistChange(waist) {
    setSelectedWaist(waist);
    setSelectedLength(null);
    setLowStockMessage("");
  }

  function handleLengthChange(length) {
    setSelectedLength(length);

    const colorPanel = product.colorPanel.find(
      (panel) => panel.color === selectedColor
    );

    const stock =
      colorPanel?.stockBySize?.waist?.[selectedWaist]?.lengths?.[length];

    if (stock <= 2 && stock > 0) {
      setLowStockMessage(
        <>
          The available quantity for Waist <strong>{selectedWaist}</strong> and
          Length <strong>{length}</strong> in <strong>{selectedColor}</strong>{" "}
          is only <strong>{stock}</strong>!
        </>
      );
    } else {
      setLowStockMessage("");
    }
  }

  const handleAddToCart = () => {
    if (isPants) {
      if (!selectedWaist || !selectedLength) {
        notifyWarning(Resources["selectSizeFirst"][currentLanguage]);
        return;
      }

      const colorPanel = product.colorPanel.find(
        (panel) => panel.color === selectedColor
      );

      const stock =
        colorPanel?.stockBySize?.waist?.[selectedWaist]?.lengths?.[
          selectedLength
        ];

      if (!stock || stock <= 0) {
        notifyWarning("Sorry, this size combination is not available.");
        return;
      }

      const existingCartItem = cartData.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedWaist === selectedWaist &&
          item.selectedLength === selectedLength
      );

      if (existingCartItem && existingCartItem.quantity >= stock) {
        notifyWarning(
          `${Resources["cannotAddMore"][currentLanguage]} ${stock}.`
        );
        return;
      }

      if (existingCartItem) {
        console.log(existingCartItem, "existingCartItem");
        if (existingCartItem.quantity >= stock) {
          notifyWarning(
            `${Resources["cannotAddMore"][currentLanguage]} + ${stock}.`
          );
          return;
        }
        setShowAnimation(false);
        setTimeout(() => setShowAnimation(true), 10);
      }

      dispatch(
        addItem({
          ...product,
          selectedWaist,
          selectedLength,
          selectedColor,
          quantity: 1,
          availableStock: stock,
        })
      );
    } else {
      if (!selectedSize) {
        notifyWarning(Resources["selectSizeFirst"][currentLanguage]);
        return;
      }
      const selectedColorStock = product.colorPanel.find(
        (color) => color.color === selectedColor
      )?.stockBySize;

      if (!selectedColorStock || !selectedColorStock[selectedSize]) {
        alert("عذراً، هذا المقاس غير متوفر حالياً.");
        return;
      }
      const availableStock = selectedColorStock[selectedSize];

      if (!availableStock || availableStock <= 0) {
        alert("عذراً، هذا المقاس غير متوفر حالياً.");
        return;
      }

      const existingCartItem = cartData.find(
        (item) =>
          item.id === product.id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize
      );

      if (existingCartItem) {
        if (existingCartItem.quantity >= availableStock) {
          notifyWarning(
            `${Resources["cannotAddMore"][currentLanguage]} + ${availableStock}.`
          );
          return;
        }
        setShowAnimation(false);
        setTimeout(() => setShowAnimation(true), 10);
      }

      dispatch(
        addItem({
          ...product,
          selectedSize,
          selectedColor,
          quantity: 1,
          availableStock,
        })
      );
    }
  };
  function handleSizeChange(size) {
    setSelectedSize(size);

    const selectedColorStock = product.colorPanel.find(
      (color) => color.color === selectedColor
    )?.stockBySize;
    console.log(selectedColorStock, "selectedColorStock");

    if (selectedColorStock && selectedColorStock[size] <= 2) {
      setLowStockMessage(
        <>
          The available quantity of this size <strong>{size}</strong> for the{" "}
          <strong>{selectedColor}</strong> color is only{" "}
          <strong>{selectedColorStock[size]}</strong>!
        </>
      );
    } else {
      setLowStockMessage("");
    }
  }
  return (
    <main className="product_details">
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <div className="container-fluid">
          {product ? (
            <div className="row">
              <div className="col-md-8 p-0">
                <div className="preview_area">
                  <ProductGallery
                    images={galleryImages}
                    selectedImage={selectedImage}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="details_area" ref={detailsRef}>
                  <div className="name-product">{product.name}</div>
                  <div className="price-product">
                    €{product.price} <span className="vat">including VAT</span>
                  </div>
                  <div className="colors-panel my-20">
                    <p className="special-gray-title-14 m-0">
                      Available color(s)
                    </p>
                    <p className="special-gray-title-14">
                      Color <span className="color-name">{selectedColor}</span>
                    </p>
                    <div className="panel">
                      <ul>
                        {product.colorPanel &&
                          product.colorPanel.map((color, index) => (
                            <li
                              className={
                                color.colorImage === selectedColorImage
                                  ? "selected-color"
                                  : ""
                              }
                              key={index}
                            >
                              <img
                                src={color.colorImage}
                                alt={color.color}
                                onClick={() =>
                                  handleColorChange(
                                    color.color,
                                    color.colorImage
                                  )
                                }
                              />
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="sizing-area">
                    <p className="special-gray-title-14 ">Sizing</p>
                    {isPants ? (
                      <>
                       
                        <p className="size special-gray-title-13 m-0">Waist</p>
                        <div className="panel">
                          <ul className="my-6">
                            {getAvailableWaistSizes().map((waist) => (
                              <li
                                key={waist}
                                className={`size-item ${
                                  selectedWaist === waist ? "selected-size" : ""
                                } ${
                                  !hasAvailableLengths(waist)
                                    ? "disabled-size"
                                    : ""
                                }`}
                                onClick={() =>
                                  hasAvailableLengths(waist) &&
                                  handleWaistChange(waist)
                                }
                              >
                                {waist}
                              </li>
                            ))}
                          </ul>
                        </div>

                       
                        {selectedWaist && (
                          <>
                            <p className="size special-gray-title-13 m-0">
                              Length
                            </p>
                            <div className="panel">
                              <ul className="my-6">
                                {availableLengths.map(({ length }) => (
                                  <li
                                    key={length}
                                    className={`size-item ${
                                      selectedLength === length
                                        ? "selected-size"
                                        : ""
                                    } ${
                                      !isLengthAvailable(length)
                                        ? "disabled-size"
                                        : ""
                                    }`}
                                    onClick={() =>
                                      isLengthAvailable(length) &&
                                      handleLengthChange(length)
                                    }
                                  >
                                    {length}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="size special-gray-title-13 m-0">Size</p>

                        <div className="panel">
                          <ul className="my-6">
                            {selectedColor &&
                              product.colorPanel.find(
                                (color) => color.color === selectedColor
                              )?.stockBySize &&
                              Object.keys(
                                product.colorPanel.find(
                                  (color) => color.color === selectedColor
                                ).stockBySize
                              ).map((size, index) => {
                                const availableStock = product.colorPanel.find(
                                  (color) => color.color === selectedColor
                                ).stockBySize[size];
                                const isAvailable = availableStock > 0;
                                return (
                                  <li
                                    key={index}
                                    className={`size-item ${
                                      selectedSize === size
                                        ? "selected-size"
                                        : ""
                                    } ${!isAvailable ? "disabled-size" : ""}`}
                                    onClick={() =>
                                      isAvailable && handleSizeChange(size)
                                    }
                                    aria-disabled={!isAvailable}
                                  >
                                    {size}
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="is-available">
                    <p>Product is available</p>
                  </div>
                  <div className="low_stock_msg">
                    <p>{lowStockMessage}</p>
                  </div>
                  <div className="buttons-area">
                    <button onClick={handleAddToCart} className="add_cart">
                      add to bag
                      {showAnimation && <QuantityIncrementAnimation />}
                    </button>
                    <button className="add_wishlist">
                      <i className="fa-regular fa-heart"></i>
                    </button>
                  </div>

                  <div className="location_ups">
                    <div className="location">
                      <div className="icon">
                        <i class="fa-solid fa-location-dot"></i>
                      </div>
                      <p>Find in local store</p>
                    </div>
                    <div className="ups">
                      <div className="wrap">
                        <div className="icon">
                          <i class="fa-solid fa-truck-fast"></i>
                        </div>
                        <p>UPS</p>
                      </div>
                      <p className="cost_shipping">Free</p>
                    </div>
                  </div>

                  <div className="accordion-panel">
                    <div
                      className="accordion accordion-flush"
                      id="accordionFlushProductDetails"
                    >
                     
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-d-staq">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseDstaq"
                            aria-expanded="false"
                            aria-controls="flush-collapseDstaq"
                          >
                            D-staq
                          </button>
                        </h2>
                        <div
                          id="flush-collapseDstaq"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-d-staq"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            <SvgPant />
                            <p className="text-accordion">
                              The D-Staq pant is a simplified version of the
                              Staq pant first launched in May 2016. It is a
                              hybrid design combining traditional denim and
                              chino details based on research conducted in the
                              G-Star Raw archive.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-material">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseMaterial"
                            aria-expanded="false"
                            aria-controls="flush-collapseMaterial"
                          >
                            Material
                          </button>
                        </h2>
                        <div
                          id="flush-collapseMaterial"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-material"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae blanditiis neque doloremque
                            maiores dolorum fugit veniam, quibusdam, excepturi,
                            nam qui distinctio aliquid. Temporibus labore
                            quaerat numquam, suscipit deleniti quia laudantium.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-features">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseFeatures"
                            aria-expanded="false"
                            aria-controls="flush-collapseFeatures"
                          >
                            Features
                          </button>
                        </h2>
                        <div
                          id="flush-collapseFeatures"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-features"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae blanditiis neque doloremque
                            maiores dolorum fugit veniam, quibusdam, excepturi,
                            nam qui distinctio aliquid. Temporibus labore
                            quaerat numquam, suscipit deleniti quia laudantium.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="flush-responsibleMaterialsRanking"
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseResponsibleMaterialsRanking"
                            aria-expanded="false"
                            aria-controls="flush-collapseResponsibleMaterialsRanking"
                          >
                            Responsible Materials Ranking
                          </button>
                        </h2>
                        <div
                          id="flush-collapseResponsibleMaterialsRanking"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-responsibleMaterialsRanking"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae blanditiis neque doloremque
                            maiores dolorum fugit veniam, quibusdam, excepturi,
                            nam qui distinctio aliquid. Temporibus labore
                            quaerat numquam, suscipit deleniti quia laudantium.
                          </div>
                        </div>
                      </div>

                    
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="flush-sizeAndFit">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseSizeAndFit"
                            aria-expanded="false"
                            aria-controls="flush-collapseSizeAndFit"
                          >
                            Size & Fit
                          </button>
                        </h2>
                        <div
                          id="flush-collapseSizeAndFit"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-sizeAndFit"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Repudiandae blanditiis neque doloremque
                            maiores dolorum fugit veniam, quibusdam, excepturi,
                            nam qui distinctio aliquid. Temporibus labore
                            quaerat numquam, suscipit deleniti quia laudantium.
                          </div>
                        </div>
                      </div>

                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="flush-descriptionAndCare"
                        >
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#flush-collapseDescriptionAndCare"
                            aria-expanded="false"
                            aria-controls="flush-collapseDescriptionAndCare"
                          >
                            Description & Care
                          </button>
                        </h2>
                        <div
                          id="flush-collapseDescriptionAndCare"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-descriptionAndCare"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Similique eaque suscipit facere velit modi.
                            Praesentium quidem corrupti, neque natus, aliquid
                            pariatur atque, sunt accusantium sequi molestias
                            libero placeat mollitia alias.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
        <RecentlyViewed />
      </div>
    </main>
  );
}
