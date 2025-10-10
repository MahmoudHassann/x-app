import React from "react";
import { useSelector } from "react-redux";
import Resources from "../locales/Resources.json";

let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";

const Shipping = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);

  return (
    <section className="refund static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header className="my-5 text-center pt-5">
            <h1 className="main-title">
              {Resources["shippingPolicyTitle"][currentLanguage]}
            </h1>
          </header>

          <section className="content-section mb-5">
            <p className="intro-text">
              {Resources["shippingPolicyIntro"][currentLanguage]}
            </p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["shippingMethodsTitle"][currentLanguage]}
            </h2>
            <p>{Resources["shippingMethodAmana"][currentLanguage]}</p>
            <p>{Resources["shippingMethodRepresentative"][currentLanguage]}</p>
          </section>

          <footer className="text-center mt-5 pt-4 border-top">
            <p className="text-muted small">
              {Resources["allRightsReserved"][currentLanguage]}
            </p>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
