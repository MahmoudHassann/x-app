import React from "react";
import { useSelector } from "react-redux";
import Resources from "../locales/Resources.json";

let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";

const Refund = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);

  return (
    <section className="refund static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header className="my-5 text-center pt-5">
            <h1 className="main-title">
              {Resources["refundPolicyTitle"][currentLanguage]}
            </h1>
          </header>

          <section className="content-section mb-5">
            <ol className="policy-list d-flex flex-wrap gap-3">
              <li>{Resources["refundPolicyList1"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList2"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList3"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList4"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList5"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList6"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList7"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList8"][currentLanguage]}</li>
              <li>{Resources["refundPolicyList9"][currentLanguage]}</li>
            </ol>
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

export default Refund;
