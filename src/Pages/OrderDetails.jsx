import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Resources from "../locales/Resources.json";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateQuantity } from "../redux/slices/cart-slice";
import { MainLoading } from "../components/Loading/MainLoading.jsx";
import { notifySuccess } from "../dependencies/Notification.js";

export default function OrderDetails() {
  const [orderDetails, setOrderDetails] = useState(() => {
    return JSON.parse(localStorage.getItem("orderDetails")) || [];
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = useSelector((state) => state.layout.navOpen);
  let cartData = useSelector((state) => state.cart.cartItems);

  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  let dispatch = useDispatch();

  const prepareOrderData = (formValues) => {
    console.log(cartData, "cartData");
    const items = cartData.map((product) => {
      const selectedColorData = product.colorPanel.find(
        (color) => color.color === product.selectedColor
      );

      const sizeData = selectedColorData?.stockBySize[product.selectedSize];
      console.log(product, "productxxxxxxxxx");
      return {
        product_color_id: product.product_color_id,
        size_id: product.selectedSizeId,
        order_qty: product.quantity,
      };
    });

    return {
      c_name: formValues.c_name,
      c_number1: formValues.c_number1,
      c_address: formValues.c_adress,
      date_of_birth: formValues.date_of_birth,
      items: items,
    };
  };

  const formatEGP = (n) => {
    const lang = localStorage.getItem("language") || "en";
    const formatted = new Intl.NumberFormat(lang === "ar" ? "ar-EG" : "en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0,
    }).format(Number(n || 0));

    if (lang === "ar") {
      return formatted.replace(/ج\.م\.?‏?/, "جم");
    }

    return formatted;
  };

  const getUnitPrice = (product) => {
    const selectedColor = product.colorPanel?.find(
      (c) => c.color === product.selectedColor
    );
    const sizeData = selectedColor?.stockBySize?.[product.selectedSize];
    return Number(
      sizeData?.price_after_sale ??
        product.price_after_sale ??
        sizeData?.price ??
        product.unitPrice ??
        product.price
    );
  };

  const lineTotal = (product) =>
    getUnitPrice(product) * Number(product.quantity || 0);

  const SHIPPING_FEE = 0;
  const TAX_PERCENT = 0;
  const DISCOUNT_VALUE = 0;

  const subTotal = useMemo(() => {
    if (!Array.isArray(orderDetails)) return 0;
    return orderDetails.reduce((sum, item) => sum + lineTotal(item), 0);
  }, [orderDetails]);

  const taxes = useMemo(
    () => Math.round((subTotal * TAX_PERCENT) / 100),
    [subTotal]
  );

  const totalAmount = useMemo(() => {
    return Math.max(0, subTotal + SHIPPING_FEE + taxes - DISCOUNT_VALUE);
  }, [subTotal, taxes]);

  return (
    <div className="checkout_cart">
      {isLoading && <MainLoading />}

      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <TopBar isDark={true} />

        <div className="container">
          <div className="section_checkOut">
            <div
              className={`head_section ${
                !orderDetails?.length > 0 && "no_items"
              }`}
            >
              {orderDetails?.length > 0 && (
                <Link to={"/shop"} className={`header_link`}>
                  <span className="icon_left">
                    {currentLanguage === "ar" && (
                      <i className="fa-solid fa-chevron-right"></i>
                    )}
                    {currentLanguage === "en" && (
                      <i className="fa-solid fa-chevron-left"></i>
                    )}
                  </span>
                  {Resources["continueShopping"][currentLanguage]}
                </Link>
              )}
              <h1 className="basic_title m-auto">
                {Resources["orderDetails"][currentLanguage]}
              </h1>
            </div>

            {orderDetails.length > 0 ? (
              <div className="row g-4">
                <div className="col-12 col-lg-8">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="fa-solid fa-circle-exclamation text-warning"></i>
                    <span className="fw-bold">
                      {Resources["orderItems"][currentLanguage]}
                    </span>
                  </div>

                  <ul className="list-unstyled m-0">
                    {orderDetails.map((item) => {
                      const selectedColor = item.colorPanel?.find(
                        (c) => c.color === item.selectedColor
                      );
                      const sizeData =
                        selectedColor?.stockBySize?.[item.selectedSize];
                      const unit = getUnitPrice(item);
                      const total = lineTotal(item);

                      return (
                        <li
                          key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
                          className="card mb-3 shadow-sm"
                        >
                          <div className="card-body">
                            <div className="row g-3 align-items-center">
                              <div className="col-3 col-md-2">
                                <img
                                  src={
                                    selectedColor?.colorImage ||
                                    selectedColor?.main_img ||
                                    ""
                                  }
                                  alt={item.name}
                                  className="img-fluid rounded"
                                />
                              </div>

                              <div className="col-9 col-md-6">
                                <h6 className="mb-1">{item.name}</h6>
                                <div className="small text-muted">
                                  <span className="me-2">
                                    <i className="fa-solid fa-palette me-1"></i>
                                    {item.selectedColor}
                                  </span>
                                  <span className="me-2">|</span>
                                  <span>
                                    <i className="fa-solid fa-ruler-combined me-1"></i>
                                    {item.selectedSize}
                                  </span>
                                </div>

                                <div className="mt-2">
                                  <span className="badge bg-light text-dark border me-2">
                                    {Resources["unitPrice"][currentLanguage]}:{" "}
                                    <strong className="ms-1">
                                      {formatEGP(unit)}
                                    </strong>
                                  </span>
                                  {console.log(item, "item")}
                                  <span className="badge bg-light text-dark border me-2">
                                    {Resources["quantity"][currentLanguage]}:
                                    <strong className="ms-1">
                                      {item.quantity}
                                    </strong>
                                  </span>
                                  {sizeData?.sale > 0 && (
                                    <span className="badge bg-danger">
                                      خصم {sizeData.sale}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="col-12 col-lg-4">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white">
                      <h6 className="m-0">
                        {Resources["orderSummary"][currentLanguage]}
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="text-muted">
                          {Resources["subtotal"][currentLanguage]}
                        </span>
                        <span className="fw-semibold">
                          {formatEGP(subTotal)}
                        </span>
                      </div>

                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">
                          {Resources["total"][currentLanguage]}
                        </span>
                        <span className="fw-bold">
                          {formatEGP(totalAmount)}
                        </span>
                      </div>
                      <hr />
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">
                          {Resources["shipping"][currentLanguage]}
                        </span>
                        <span className="fw-bold">
                          {!orderDetails[0].shipping ? (
                            <p>{Resources["free"][currentLanguage]}</p>
                          ) : (
                            <>
                              {orderDetails[0].shipping} جم
                            </>
                          )}
                        </span>
                      </div>

                      <Link
                        to={"/"}
                        type="button"
                        className="btn btn-dark w-100 mt-3"
                      >
                        <i className="fa-solid fa-house me-2"></i>
                        {Resources["goToHome"][currentLanguage]}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="wrap_cart_empty">
                <div className="cart_empty">
                  <p>Your Not Have Order</p>
                </div>
                {!orderDetails?.length > 0 && (
                  <Link to={"/shop"} className={`header_link`}>
                    <span className="icon_left">
                      {currentLanguage === "ar" && (
                        <i className="fa-solid fa-chevron-right"></i>
                      )}
                      {currentLanguage === "en" && (
                        <i className="fa-solid fa-chevron-left"></i>
                      )}
                    </span>
                    {Resources["continueShopping"][currentLanguage]}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
