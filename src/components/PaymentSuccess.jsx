import React from "react";
import { useLocation, Link } from "react-router-dom";
import Resources from "../locales/Resources.json";

const PaymentSuccess = () => {
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;
  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  console.log(orderDetails, "orderDetails");
  return (
    <div className="callback_page">
      <div className="wrapper">
        <div className="head">
          <div className="icon_success">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2>Payment Successful !</h2>
        </div>

        <p className="message">Thank you for your purchase.</p>

        {orderDetails && (
          <div className="order_details">
            <h4>Order Details:</h4>

            <p>
              <span>Order ID:</span> {orderDetails.orderId}
            </p>
            <p>
              <span>Amount:</span> {(orderDetails.amount / 100).toFixed(2)}{" "}
              {orderDetails.currency}
            </p>
            <p>
              <span>Payment Method:</span> {orderDetails.paymentMethod.subType}
            </p>
          </div>
        )}

        <div className="actions_bottom">
          <Link to={"/shop"} className={`header_link `}>
            <span className="icon_left">
              <i className="fa-solid fa-chevron-left"></i>
            </span>
            {Resources["continueShopping"][currentLanguage]}
          </Link>
          <Link className="large_button" to="/orders">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
