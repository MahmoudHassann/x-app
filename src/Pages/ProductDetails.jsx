import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductGallery from "./ProductGallery.jsx";
import SvgPant from "../components/Shop/SvgPant.jsx";
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed.jsx";
import { addItem } from "../redux/slices/cart-slice.js";
import { notifyError, notifyWarning } from "../dependencies/Notification.js";
import QuantityIncrementAnimation from "../dependencies/QuantityIncrementAnimation";
import Resources from "../locales/Resources.json";

import Api from "../dependencies/instanceAxios.js";

const IMG_BASE = "https://mister-x-store.com/mister_x_site/public/imgs/";

function normalizeProduct(res) {
  const colorPanel = (res.colors || []).map((c) => {
    const stockBySize = {};
    (c.stock || []).forEach((s) => {
      stockBySize[String(s.size)] = {
        qty: Number(s.quantity || 0),
        price: Number(s.price || 0),
        sale: Number(s.sale || 0),
        price_after_sale: Number(s.price_after_sale || s.price || 0),
        size_type: s.size_type || null,
        branch: s.branch || null,
        size_id: s.size_id || null,
      };
    });

    return {
      color: c.color_name,
      product_color_id: c.product_color_id,
      colorImage: IMG_BASE + c.thumbnail,
      main_img: IMG_BASE + c.main_img,
      hover_img: IMG_BASE + c.hover_img,
      gallery: (c.gallery || []).map((g) => IMG_BASE + g.img),
      stockBySize,
    };
  });

  const firstPanel = colorPanel[0];
  let price = 0;
  if (firstPanel) {
    const firstSizeKey = Object.keys(firstPanel.stockBySize || {})[0];
    if (firstSizeKey) {
      price =
        firstPanel.stockBySize[firstSizeKey].price_after_sale ||
        firstPanel.stockBySize[firstSizeKey].price ||
        0;
    }
  }

  return {
    id: res.product_id,
    name: res.product_name,
    shipping: res.shipping,
    category: res.category,
    bestsellers: !!res.Bestsellers,
    sale: Number(res.Sale || 0),
    price,
    colorPanel,
  };
}

export default function ProductDetails() {
  const detailsRef = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColorImage, setSelectedColorImage] = useState(null);

  const [lowStockMessage, setLowStockMessage] = useState("");
  const [showAnimation, setShowAnimation] = useState(false);

  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedSizeId, setSelectedSizeId] = useState(null);

  const cartData = useSelector((state) => state.cart.cartItems);
  const isOpen = useSelector((state) => state.layout.navOpen);

  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";

  const fetchProduct = async () => {
    const response = await Api.get(`products/${id}`);
    if (response && response.status === 200) {
      return response.data?.data ?? data;
    }
  };

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        const response = await fetchProduct();
        console.log(response, "response");
        const normalized = normalizeProduct(response);
        if (ignore) return;

        setProduct(normalized);

        if (normalized?.colorPanel?.length) {
          const colorFromUrl = searchParams.get("color");
          const initialPanel = colorFromUrl
            ? normalized.colorPanel.find((p) => p.color === colorFromUrl)
            : normalized.colorPanel[0];

          if (initialPanel) {
            setSelectedColor(initialPanel.color);
            setGalleryImages(initialPanel.gallery || []);
            setSelectedImage((initialPanel.gallery || [])[0] || "");
            setSelectedColorImage(initialPanel.colorImage);
          }
        }

        setSelectedSize(null);
        setLowStockMessage("");
      } catch (err) {
        console.error(err);
        notifyError("Error fetching product details");
      }
    })();

    return () => {
      ignore = true;
    };
  }, [id, searchParams]);

  const currentPanel = useMemo(() => {
    if (!product || !selectedColor) return null;
    return product.colorPanel.find((p) => p.color === selectedColor) || null;
  }, [product, selectedColor]);

  const availableSizes = useMemo(() => {
    if (!currentPanel?.stockBySize) return [];

    return Object.entries(currentPanel.stockBySize)
      .filter(([, info]) => (info?.qty || 0) > 0)
      .map(([size]) => size);
  }, [currentPanel]);

  const currentPriceInfo = useMemo(() => {
    if (!currentPanel) return null;
    if (selectedSize && currentPanel.stockBySize[selectedSize]) {
      const info = currentPanel.stockBySize[selectedSize];
      return {
        price: info.price,
        sale: info.sale,
        price_after_sale: info.price_after_sale ?? info.price,
      };
    }

    const firstKey = Object.keys(currentPanel.stockBySize || {})[0];
    if (!firstKey) return null;
    const info = currentPanel.stockBySize[firstKey];
    return {
      price: info.price,
      sale: info.sale,
      price_after_sale: info.price_after_sale ?? info.price,
    };
  }, [currentPanel, selectedSize]);

  function handleColorChange(color, image) {
    if (!product) return;
    if (color === selectedColor) return;

    const panel = product.colorPanel.find((p) => p.color === color);
    if (!panel) return;

    setSelectedColor(color);
    setSelectedColorImage(image);
    setGalleryImages(panel.gallery || []);
    setSelectedImage((panel.gallery || [])[0] || "");
    setSelectedSize(null);
    setLowStockMessage("");
  }

  function handleSizeChange(size, size_id) {
    setSelectedSize(size);
    setSelectedSizeId(size_id);
    if (!currentPanel) return;

    const info = currentPanel.stockBySize[size];
    if (info && info.qty <= 2 && info.qty > 0) {
      setLowStockMessage(
        <>
          {Resources["only"][currentLanguage]} <strong>{info.qty}</strong> {Resources["leftForSize"][currentLanguage]} <strong>{size}</strong>{" "}
          {Resources["fromColor"][currentLanguage]} <strong>{selectedColor}</strong>!
        </>
      );
    } else {
      setLowStockMessage(
        <>
          <span className="stock-available">
             {Resources["availableStocks"][currentLanguage]} <strong>{info.qty}</strong> {Resources["forSize"][currentLanguage]}{" "}
            <strong>{size}</strong>
          </span>
        </>
      );
    }
  }

  const handleAddToCart = () => {
    console.log(product, "product");
    if (!product || !currentPanel) return;

    if (!selectedSize) {
      notifyWarning(
        Resources["selectSizeFirst"][currentLanguage] || "Select a size first"
      );
      return;
    }

    const info = currentPanel.stockBySize[selectedSize];
    const stock = info?.qty || 0;
    if (stock <= 0) {
      notifyWarning("Sorry, this size is not available.");
      return;
    }

    const existingCartItem = cartData.find(
      (item) =>
        item.id === product.id &&
        item.selectedColor === selectedColor &&
        item.selectedSize === selectedSize
    );

    if (existingCartItem && existingCartItem.quantity >= stock) {
      notifyWarning(`You cannot add more than ${stock}.`);
      return;
    }

    if (existingCartItem) {
      setShowAnimation(false);
      setTimeout(() => setShowAnimation(true), 10);
    }
    console.log(currentPanel, "currentPanelcurrentPanel");
    dispatch(
      addItem({
        ...product,
        selectedColor,
        selectedSize,
        selectedSizeId,
        unitPrice: info.price_after_sale ?? info.price,
        product_color_id: currentPanel.product_color_id,
        price: info.price,
        sale: info.sale,
        price_after_sale: info.price_after_sale ?? info.price,
        quantity: 1,
        availableStock: stock,
      })
    );
  };

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
                    onChangeMain={(src) => setSelectedImage(src)}
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="details_area" ref={detailsRef}>
                  <div className="name-product">{product.name}</div>

                  <div className="price-product">
                    {currentPriceInfo ? (
                      currentPriceInfo.sale > 0 ? (
                        <>
                          <span className="text-decoration-line-through me-2">
                            {Resources["EGP"][currentLanguage]}{" "}
                            {Number(currentPriceInfo.price).toFixed(2)}
                          </span>
                          <span className="fw-bold">
                            {Resources["EGP"][currentLanguage]}
                            {Number(currentPriceInfo.price_after_sale).toFixed(
                              2
                            )}
                          </span>
                          <span className="vat">
                            {" "}
                            {Resources["includingVat"][currentLanguage]}
                          </span>
                        </>
                      ) : (
                        <>
                          {Resources["EGP"][currentLanguage]}{" "}
                          {Number(currentPriceInfo.price).toFixed(2)}
                          <span className="vat">
                            {" "}
                            {Resources["includingVat"][currentLanguage]}
                          </span>
                        </>
                      )
                    ) : (
                      <>
                        {Resources["EGP"][currentLanguage]}{" "}
                        {Number(product.price || 0).toFixed(2)}{" "}
                        <span className="vat">
                          {" "}
                          {Resources["includingVat"][currentLanguage]}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="colors-panel my-20">
                    <p className="special-gray-title-14 m-0">
                      {Resources["AvailableColors"][currentLanguage]}
                    </p>
                    <p className="special-gray-title-14">
                      {Resources["Color"][currentLanguage]}{" "}
                      <span className="color-name">{selectedColor}</span>
                    </p>
                    <div className="panel">
                      <ul>
                        {product.colorPanel?.map((c, idx) => (
                          <li
                            className={
                              c.colorImage === selectedColorImage
                                ? "selected-color"
                                : ""
                            }
                            key={idx}
                          >
                            <img
                              src={c.colorImage}
                              alt={c.color}
                              onClick={() =>
                                handleColorChange(c.color, c.colorImage)
                              }
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="sizing-area">
                    <p className="special-gray-title-14 ">
                      {Resources["Sizing"][currentLanguage]}
                    </p>
                    <>
                      <p className="size special-gray-title-13 m-0">
                        {Resources["size"][currentLanguage]}
                      </p>
                      <div className="panel">
                        <ul className="my-6">
                          {console.log(
                            currentPanel.stockBySize,
                            "currentPanel.stockBySize"
                          )}
                          {currentPanel &&
                            Object.keys(currentPanel.stockBySize || {}).map(
                              (size, index) => {
                                console.log(size, "sizeeee");
                                const info = currentPanel.stockBySize[size];
                                console.log(info, "infoinfoinfoinfo");
                                const isAvailable = (info?.qty || 0) > 0;
                                return (
                                  <li
                                    key={index}
                                    className={`size-item ${
                                      selectedSize === size
                                        ? "selected-size"
                                        : ""
                                    } ${!isAvailable ? "disabled-size" : ""}`}
                                    onClick={() =>
                                      isAvailable &&
                                      handleSizeChange(size, info.size_id)
                                    }
                                    aria-disabled={!isAvailable}
                                  >
                                    {size}
                                  </li>
                                );
                              }
                            )}
                        </ul>
                      </div>
                    </>
                  </div>

                  <div className="is-available">
                    <p>{Resources["productIsAvailable"][currentLanguage]}</p>
                  </div>
                  <div className="low_stock_msg">
                    <p>{lowStockMessage}</p>
                  </div>

                  <div className="buttons-area">
                    <button onClick={handleAddToCart} className="add_cart">
                      {Resources["addToBag"][currentLanguage]}
                      {showAnimation && <QuantityIncrementAnimation />}
                    </button>
                  </div>

                  <div className="location_ups">
                    {/* <div className="location">
                      <div className="icon">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <p>Find in local store</p>
                    </div> */}
                    <div className="ups">
                      <div className="wrap">
                        <div className="icon">
                          <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <p>UPS</p>
                      </div>
                      {console.log(product, "proddd")}
                      <p className="cost_shipping">
                        <span style={{color:'black',textTransform:'capitalize', marginInlineEnd:'0.5rem'}}>{Resources["shippingCost"][currentLanguage]}:</span>
                        {product.shipping
                          ? product.shipping
                          : Resources["FreeShipping"][currentLanguage]}
                      </p>
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
                            {Resources["availableBranches"][currentLanguage]}
                          </button>
                        </h2>
                        <div
                          id="flush-collapseDstaq"
                          className="accordion-collapse collapse"
                          aria-labelledby="flush-d-staq"
                          data-bs-parent="#accordionFlushProductDetails"
                        >
                          <div className="accordion-body">
                            {currentPanel &&
                              (() => {
                                const grouped = Object.keys(
                                  currentPanel.stockBySize || {}
                                ).reduce((acc, size) => {
                                  const info =
                                    currentPanel.stockBySize[size] || {};
                                  const branch = info.branch || "";
                                  if (!acc[branch]) acc[branch] = [];
                                  acc[branch].push({
                                    size,
                                    qty: info.qty ?? 0,
                                  });
                                  return acc;
                                }, {});

                                return Object.entries(grouped).map(
                                  ([branchName, items], index) => {
                                    const sortedItems = [...items].sort(
                                      (a, b) => {
                                        const na = parseFloat(a.size);
                                        const nb = parseFloat(b.size);
                                        const aIsNum = !isNaN(na);
                                        const bIsNum = !isNaN(nb);
                                        if (aIsNum && bIsNum) return na - nb;
                                        if (aIsNum) return -1;
                                        if (bIsNum) return 1;
                                        return String(a.size).localeCompare(
                                          String(b.size),
                                          "ar"
                                        );
                                      }
                                    );

                                    const total = sortedItems.reduce(
                                      (s, it) => s + (Number(it.qty) || 0),
                                      0
                                    );

                                    return (
                                      <div
                                        key={index}
                                        className="branch-section mb-4"
                                      >
                                        <h5 className="branch-title">
                                          {branchName}
                                        </h5>
                                        <table className="table table-bordered table-striped text-center align-middle">
                                          <thead className="table-light">
                                            <tr>
                                              <th>
                                                {" "}
                                                {
                                                  Resources["size"][
                                                    currentLanguage
                                                  ]
                                                }
                                              </th>
                                              <th>
                                                {
                                                  Resources["quantity"][
                                                    currentLanguage
                                                  ]
                                                }
                                              </th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {sortedItems.map((item, idx) => (
                                              <tr
                                                key={idx}
                                                className={
                                                  item.qty === 0
                                                    ? "table-danger"
                                                    : ""
                                                }
                                                title={
                                                  item.qty > 0
                                                    ? "متاح"
                                                    : "غير متاح"
                                                }
                                              >
                                                <td>{item.size}</td>
                                                <td>{item.qty}</td>
                                              </tr>
                                            ))}
                                            <tr className="table-secondary fw-bold">
                                              <td>
                                                {
                                                  Resources["total"][
                                                    currentLanguage
                                                  ]
                                                }
                                              </td>
                                              <td>{total}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    );
                                  }
                                );
                              })()}
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
        {/* <RecentlyViewed /> */}
      </div>
    </main>
  );
}
