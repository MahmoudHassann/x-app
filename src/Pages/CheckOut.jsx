import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Resources from "../locales/Resources.json";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { updateQuantity } from "../redux/slices/cart-slice";
import { MainLoading } from "../components/Loading/MainLoading.jsx";
import { notifySuccess } from "../dependencies/Notification.js";
import axios from "axios";

export default function CheckOut() {
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

  const CheckoutSchema = Yup.object().shape({
    c_name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must be less than 50 characters")
      .required("* Name is required"),
    c_number1: Yup.string()
      .matches(/^[0-9]+$/, "Phone number must contain only numbers")
      .min(11, "Phone number must be at least 11 digits")
      .max(15, "Phone number must be less than 15 digits")
      .required("* Phone number is required"),
    c_adress: Yup.string()
      .min(10, "Address must be at least 10 characters")
      .max(200, "Address must be less than 200 characters")
      .required("* Address is required"),
    date_of_birth: Yup.date()
      .max(new Date(), "Date of birth cannot be in the future")
      .required("* Date of birth is required")
      .test("age", "You must be at least 16 years old", function (value) {
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
    const items = cartData.map((product) => {
      const selectedColorData = product.colorPanel.find(
        (color) => color.color === product.selectedColor
      );

      const sizeData = selectedColorData?.stockBySize[product.selectedSize];
      console.log(product,'product')
      return {
        product_color_id: product.product_color_id,
        size_id: product.selectedSize,
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
      const response = await axios.post(
        `https://mister-x-store.com/mister_x_site/public/api/order`,
        orderData
      );
      console.log(response, "response");
      notifySuccess("Order submitted successfully!");
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
      {console.log(cartData,'cartData')}
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
                    <i className="fa-solid fa-chevron-left"></i>
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
                                Size: {productCheckOut.selectedSize} |{" "}
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
                                EGP{" "}
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
                        validationSchema={CheckoutSchema}
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
                              <p className="data">EGP {subTotal}</p>
                            </div>

                            <div className="shipping">
                              <div className="name">
                                {Resources["shipping"][currentLanguage]}
                              </div>
                              <div className="data">
                                {Resources["free"][currentLanguage]}
                              </div>
                            </div>

                            <ul className="points">
                              <li>
                                <span className="icon_left">
                                  <i className="fa-solid fa-check"></i>
                                </span>
                                <p>
                                  {
                                    Resources["ordersCanBeDelivered"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>
                              <li>
                                <p>
                                  <span className="icon_left">
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                  {
                                    Resources["oneToTwoDaysDeliveryTime"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>
                              <li className="is_free">
                                <p>
                                  <span className="icon_left">
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                  {
                                    Resources["free60DayReturns"][
                                      currentLanguage
                                    ]
                                  }
                                </p>
                              </li>
                              <li className="is_return">
                                <p>
                                  <span className="icon_left">
                                    <i className="fa-solid fa-check"></i>
                                  </span>
                                  {
                                    Resources[
                                      "inStorePickupAndReturnsEligible"
                                    ][currentLanguage]
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
                                <p className="data">EGP {totalAmount}</p>
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
                      <i className="fa-solid fa-chevron-left"></i>
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
