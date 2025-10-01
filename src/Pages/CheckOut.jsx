import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Resources from "../locales/Resources.json";
import TopBar from "../components/TopBar";
import { Link } from "react-router-dom";
import { paymobService } from "../services/paymobService";

import { updateQuantity } from "../redux/slices/cart-slice";
import { MainLoading } from "../components/Loading/MainLoading.jsx";
export default function CheckOut() {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testUserDetails, setTestUserDetails] = useState({
    firstName: "Islam",
    lastName: "Mohamed",
    email: "islammohamed.me@gmail.com",
    phone: "01011151022",
    street: "3 st ard eltrab",
    city: "bahtim",
    state: "Test",
    country: "Egypt",
    postalCode: "112233",
  });
  const isOpen = useSelector((state) => state.layout.navOpen);
  let cartData = useSelector((state) => state.cart.cartItems);
  let subTotal = useSelector((state) => state.cart.subTotal);
  let totalAmount = useSelector((state) => state.cart.totalAmount);

  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  let dispatch = useDispatch();

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
    return (parseFloat(product.price) * product.quantity).toFixed(2);
  };

  const handlePayment = async (userInfo) => {
    setIsLoading(true);
    try {
      setError(null);

      const authToken = await paymobService.authenticate();

      const formattedItems = paymobService.formatCartItems(cartData);
      const orderId = await paymobService.registerOrder(
        authToken,
        totalAmount,
        formattedItems
      );

      const billingData = paymobService.createBillingData(userInfo);
      const paymentKey = await paymobService.getPaymentKey(
        authToken,
        orderId,
        totalAmount,
        billingData
      );

      const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${paymobService.frameId}?payment_token=${paymentKey}`;
      window.location.href = iframeUrl;
    } catch (error) {
      console.error("Payment process error:", error);
      setError("Error: Plz Try Again.");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="checkout_cart">
      {isLoading && <MainLoading />}
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
              <h1 className="basic_title">
                {Resources["shoppingBag"][currentLanguage]}
              </h1>
              {cartData.length > 0 && (
                <div
                  className="xLarge_button"
                  onClick={() => handlePayment(testUserDetails)}
                >
                  {Resources["proceedToCheckout"][currentLanguage]}
                  <span className="icon_right">
                    <i className="fa-solid fa-chevron-right"></i>
                  </span>
                </div>
              )}
            </div>
            {cartData.length > 0 && (
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
                        <li className="product">
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
                                €{" "}
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
                  <div className="grid_wrap">
                    <div className="checkout_details">
                      <div className="sub_total">
                        <p className="name">
                          {Resources["subtotal"][currentLanguage]}
                        </p>
                        <p className="data">€ {subTotal}</p>
                      </div>
                      <div className="shipping">
                        <div className="name">
                          {Resources["shipping"][currentLanguage]}
                        </div>
                        <div className="data">
                          {Resources["free"][currentLanguage]}
                        </div>
                      </div>
                      <div className="shipping_type">
                        {Resources["shippingType"][currentLanguage]}
                      </div>
                      <ul className="points">
                        <li>
                          <span className="icon_left">
                            <i className="fa-solid fa-check"></i>
                          </span>
                          <p>
                            {Resources["ordersCanBeDelivered"][currentLanguage]}
                          </p>
                        </li>
                        <li>
                          <p>
                            <span className="icon_left">
                              <i class="fa-solid fa-check"></i>
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
                            {Resources["free60DayReturns"][currentLanguage]}
                          </p>
                        </li>
                        <li className="is_return">
                          <p>
                            <span className="icon_left">
                              <i class="fa-solid fa-check"></i>
                            </span>
                            {
                              Resources["inStorePickupAndReturnsEligible"][
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
                            <span>{Resources["inclVat"][currentLanguage]}</span>
                          </p>
                          <p className="data">€ {totalAmount}</p>
                        </div>
                      </div>
                      <div className="action_btns">
                        <div
                          className="large_button"
                          onClick={() => handlePayment(testUserDetails)}
                        >
                          {Resources["proceedToCheckout"][currentLanguage]}
                          <span className="icon_right">
                            <i class="fa-solid fa-chevron-right"></i>
                          </span>
                        </div>
                        <div
                          onClick={() => handlePayment(testUserDetails)}
                          className="large_button payPal"
                        >
                          <img src="/paypal-button-logo.png" alt="" />
                          <p>Checkout</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {!cartData.length > 0 && (
              <div className="wrap_cart_empty">
                <div className="cart_empty">
                  <p>Your shopping bag is empty</p>
                </div>
                {!cartData.length > 0 && (
                  <Link to={"/shop"} className={`header_link `}>
                    <span className="icon_left">
                      <i class="fa-solid fa-chevron-left"></i>
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
