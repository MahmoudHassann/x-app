import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Resources from "../locales/Resources.json";
import TopBar from "../components/TopBar";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { clearCart, updateQuantity } from "../redux/slices/cart-slice";
import { MainLoading } from "../components/Loading/MainLoading.jsx";
import { notifySuccess } from "../dependencies/Notification.js";

import Api from "../dependencies/instanceAxios.js";

export default function CheckOut(props) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isOpen = useSelector((state) => state.layout.navOpen);
  let cartData = useSelector((state) => state.cart.cartItems);
  let subTotal = useSelector((state) => state.cart.subTotal);
  let totalAmount = useSelector((state) => state.cart.totalAmount);

  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const validationSchema = Yup.object({
    c_name: Yup.string()
      .min(3, Resources.nameMin[currentLanguage])
      .max(50, Resources.nameMax[currentLanguage])
      .required(Resources.nameRequired[currentLanguage]),

    c_number1: Yup.string()
      .matches(/^[0-9]+$/, Resources.phoneOnlyNumbers[currentLanguage])
      .min(11, Resources.phoneMin[currentLanguage])
      .max(15, Resources.phoneMax[currentLanguage])
      .required(Resources.phoneRequired[currentLanguage]),

    c_adress: Yup.string()
      .min(10, Resources.addressMin[currentLanguage])
      .max(200, Resources.addressMax[currentLanguage])
      .required(Resources.addressRequired[currentLanguage]),

    date_of_birth: Yup.date()
      .max(new Date(), Resources.dobMax[currentLanguage])
      .required(Resources.dobRequired[currentLanguage])
      .test("age", Resources.dobMinAge[currentLanguage], function (value) {
        const cutoff = new Date();
        cutoff.setFullYear(cutoff.getFullYear() - 16);
        return value <= cutoff;
      }),
  });

  const handleChangeQuantity = (
    id,
    selectedSize,
    selectedColor,
    newQuantity
  ) => {
    dispatch(
      updateQuantity({
        id,
        selectedSize,
        selectedColor,
        quantity: parseInt(newQuantity),
      })
    );
  };

  const calculateTotalPricePerProject = (product) => {
    return (parseFloat(product.price_after_sale) * product.quantity).toFixed(2);
  };

  const prepareOrderData = (formValues) => {
    console.log(cartData, "cartData");
    const items = cartData.map((product) => {
      const selectedColorData = product.colorPanel.find(
        (color) => color.color === product.selectedColor
      );

      const sizeData = selectedColorData?.stockBySize[product.selectedSize];

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

  const handleSubmitOrder = async (values, { setSubmitting }) => {
    setIsLoading(true);
    setError(null);

    try {
      const orderData = prepareOrderData(values);
      console.log("Order Data:", orderData);

      const response = await Api.post(`order`, orderData);
      if (response && response.status === 200) {
        notifySuccess("Order submitted successfully!");

        const oldOrderDetails =
          JSON.parse(localStorage.getItem("orderDetails")) || [];

        const newOrderDetails = [...cartData];

        localStorage.setItem("orderDetails", JSON.stringify(newOrderDetails));
        dispatch(clearCart());
        navigate("/checkout/order-details");
      }
      console.log(response, "response");
    } catch (error) {
      console.error("Order submission error:", error);
      {
        console.log(error, "error");
      }
      setError(
        error.response.data.message ||
          "Error submitting order. Please try again."
      );
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout_cart">
      {isLoading && <MainLoading />}
      {console.log(cartData, "cartData")}
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <TopBar isDark={true} />

        <div className="container">
          <div className="section_checkOut">
            <div
              className={`head_section ${!cartData.length > 0 && "no_items"}`}
            >
              {cartData.length > 0 && (
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
                {Resources["shoppingBag"][currentLanguage]}
              </h1>
            </div>

            {cartData.length > 0 ? (
              <div className="row">
                <div className="col-12 col-md-7">
                  <div className="grid_wrap">
                    <div className="not_reserved">
                      <span className="icon_left">
                        <i className="fa-solid fa-circle-exclamation"></i>
                      </span>
                      <span className="bold">
                        {Resources["itemsNotReserved"][currentLanguage]}
                        <span>
                          <br />
                          {
                            Resources["checkoutNowToMakeThemYours"][
                              currentLanguage
                            ]
                          }
                        </span>
                      </span>
                    </div>

                    <div className="cart_products">
                      {cartData.map((productCheckOut) => (
                        <li
                          className="product"
                          key={`${productCheckOut.id}-${productCheckOut.selectedSize}-${productCheckOut.selectedColor}`}
                        >
                          <div className="image">
                            <img
                              src={
                                productCheckOut.colorPanel.find(
                                  (color) =>
                                    color.color ===
                                    productCheckOut.selectedColor
                                )?.colorImage || ""
                              }
                              alt={productCheckOut.name}
                            />
                          </div>
                          <div className="details">
                            <div className="head">
                              <p className="product_name">
                                {productCheckOut.name}
                              </p>
                              <p className="color_and_size">
                                {Resources["size"][currentLanguage]}:{" "}
                                {productCheckOut.selectedSize} |{" "}
                                {productCheckOut.selectedColor}
                              </p>
                            </div>

                            <div className="bottom">
                              <div className="quantity">
                                <span>
                                  {Resources["quantity"][currentLanguage]}
                                </span>
                                <select
                                  value={productCheckOut.quantity}
                                  onChange={(e) =>
                                    handleChangeQuantity(
                                      productCheckOut.id,
                                      productCheckOut.selectedSize,
                                      productCheckOut.selectedColor,
                                      e.target.value
                                    )
                                  }
                                >
                                  {[
                                    ...Array(
                                      productCheckOut.availableStock
                                    ).keys(),
                                  ].map((num) => (
                                    <option key={num + 1} value={num + 1}>
                                      {num + 1}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <p className="price">
                                {Resources["EGP"][currentLanguage]}
                                {calculateTotalPricePerProject(productCheckOut)}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-md-5">
                  <div className="grid_wrap form-parent mt-0">
                    <div className="checkout_details form-auth">
                      <Formik
                        initialValues={{
                          c_name: "",
                          c_number1: "",
                          c_adress: "",
                          date_of_birth: "",
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmitOrder}
                      >
                        {({ errors, touched, isSubmitting }) => (
                          <Form>
                            <div className="customer_form mb-4">
                              <h3 className="form_title">
                                {Resources["customerInformation"]?.[
                                  currentLanguage
                                ] || "Customer Information"}
                              </h3>

                              <div className="form-floating">
                                <Field
                                  type="text"
                                  name="c_name"
                                  id="c_name"
                                  placeholder={
                                    Resources["name"]?.[currentLanguage] ||
                                    "Name"
                                  }
                                  className={`form-control ${
                                    touched.c_name && errors.c_name
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                />
                                <label htmlFor="c_name">
                                  {Resources["name"]?.[currentLanguage] ||
                                    "Name"}{" "}
                                  *
                                </label>
                                <ErrorMessage
                                  name="c_name"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="form-floating">
                                <Field
                                  type="tel"
                                  name="c_number1"
                                  id="c_number1"
                                  placeholder={
                                    Resources["phoneNumber"]?.[
                                      currentLanguage
                                    ] || "Phone Number"
                                  }
                                  className={`form-control ${
                                    touched.c_number1 && errors.c_number1
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                />
                                <label htmlFor="c_number1">
                                  {Resources["phoneNumber"]?.[
                                    currentLanguage
                                  ] || "Phone Number"}{" "}
                                  *
                                </label>
                                <ErrorMessage
                                  name="c_number1"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="form-floating">
                                <Field
                                  as="textarea"
                                  name="c_adress"
                                  id="c_adress"
                                  placeholder={
                                    Resources["address"]?.[currentLanguage] ||
                                    "Address"
                                  }
                                  rows="3"
                                  className={`form-control ${
                                    touched.c_adress && errors.c_adress
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                  style={{ minHeight: "100px" }}
                                />
                                <label htmlFor="c_adress">
                                  {Resources["address"]?.[currentLanguage] ||
                                    "Address"}{" "}
                                  *
                                </label>
                                <ErrorMessage
                                  name="c_adress"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>

                              <div className="form-floating">
                                <Field
                                  type="date"
                                  name="date_of_birth"
                                  id="date_of_birth"
                                  placeholder={
                                    Resources["dateOfBirth"]?.[
                                      currentLanguage
                                    ] || "Date of Birth"
                                  }
                                  className={`form-control ${
                                    touched.date_of_birth &&
                                    errors.date_of_birth
                                      ? "is-invalid"
                                      : ""
                                  }`}
                                />
                                <label htmlFor="date_of_birth">
                                  {Resources["dateOfBirth"]?.[
                                    currentLanguage
                                  ] || "Date of Birth"}{" "}
                                  *
                                </label>
                                <ErrorMessage
                                  name="date_of_birth"
                                  component="div"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>

                            {error && (
                              <div className="error_message alert alert-danger">
                                <span className="icon_left">
                                  <i className="fa-solid fa-circle-exclamation"></i>
                                </span>
                                {console.log(error, "error")}
                                {error}
                              </div>
                            )}

                            <div className="sub_total">
                              <p className="name">
                                {Resources["subtotal"][currentLanguage]}
                              </p>
                              <p className="data">
                                {Resources["EGP"][currentLanguage]} {subTotal}
                              </p>
                            </div>

                            <div className="shipping">
                              <div className="name">
                                {Resources["shipping"][currentLanguage]}
                              </div>
                              {console.log(cartData, "cartData")}
                              <div className="data">
                                {!cartData[0].shipping ? (
                                  <p>{Resources["free"][currentLanguage]}</p>
                                ) : (
                                  <p>
                                    {Resources["EGP"][currentLanguage]}{" "}
                                    {cartData[0].shipping}
                                  </p>
                                )}
                              </div>
                            </div>

                            <ul className="points">
                              <li>
                                <span className="icon_left">
                                  <i className="fa-solid fa-check"></i>
                                </span>
                                <p>
                                  {
                                    Resources["afterOrderConfirmed"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>

                              <li className="column">
                                <p>
                                  {
                                    Resources["availableShippingMethods"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                                <ul className="sub_points">
                                  <li>
                                    {
                                      Resources["amanaExpressDelivery"][
                                        currentLanguage
                                      ]
                                    }
                                  </li>
                                  <li>
                                    {
                                      Resources["deliveryAgentService"][
                                        currentLanguage
                                      ]
                                    }
                                  </li>
                                </ul>
                              </li>

                              <li>
                                <span className="icon_left">
                                  <i className="fa-solid fa-check"></i>
                                </span>
                                <p>
                                  {
                                    Resources["trustedShippingTeam"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>

                              <li className="is_free">
                                <span className="icon_left">
                                  <i className="fa-solid fa-check"></i>
                                </span>
                                <p>
                                  {
                                    Resources["shipmentTrackingNotification"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>
                            </ul>

                            <div className="payment_details">
                              <div className="details">
                                <p className="name">
                                  {Resources["total"][currentLanguage]}{" "}
                                  <span>
                                    {Resources["inclVat"][currentLanguage]}
                                  </span>
                                </p>
                                <p className="data">
                                  {Resources["EGP"][currentLanguage]}{" "}
                                  {totalAmount}
                                </p>
                              </div>
                            </div>

                            <div className="action_btns">
                              <button
                                type="submit"
                                className="large_button"
                                disabled={isSubmitting || isLoading}
                              >
                                {isSubmitting || isLoading
                                  ? "Processing..."
                                  : Resources["proceedToCheckout"][
                                      currentLanguage
                                    ]}
                                <span className="icon_right">
                                  <i className="fa-solid fa-chevron-right"></i>
                                </span>
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="wrap_cart_empty">
                <div className="cart_empty">
                  <p>Your shopping bag is empty</p>
                </div>
                {!cartData.length > 0 && (
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
