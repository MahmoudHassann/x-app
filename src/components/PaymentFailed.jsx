import React from "react";
import { useLocation, Link } from "react-router-dom";
import Resources from "../locales/Resources.json";

const PaymentFailed = () => {
  const location = useLocation();
  const error =
    location.state?.error || "An error occurred during payment processing";

  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  return (
    <div className="callback_page">
      <div className="wrapper">
        <div className="head">
          <div className="icon_failed">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="title_faild">Payment Failed</h2>
        </div>
        <p className="message">{error}</p>
        <div className="actions_bottom">
          <Link to={"/shop"} className={`header_link`}>
            <span className="icon_left">
              <i className="fa-solid fa-chevron-left"></i>
            </span>
            Return to Shop
          </Link>
          <Link className="large_button" to="/checkout/shopping-bag">
            Try Again
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
