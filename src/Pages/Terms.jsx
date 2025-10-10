import React from "react";
import { useSelector } from "react-redux";
import Resources from "../locales/Resources.json";

let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";

const Terms = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);

  return (
    <section className="terms static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header className="my-5 text-center pt-5">
            <h1 className="main-title">
              {Resources["termsOfUseTitle"][currentLanguage]}
            </h1>
          </header>

          <div className="container">
            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["termsIntroTitle"][currentLanguage]}
              </h2>
              <p>{Resources["termsIntroText1"][currentLanguage]}</p>
              <p>{Resources["termsIntroText2"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["termsUseTitle"][currentLanguage]}
              </h2>
              <p>{Resources["termsUseText1"][currentLanguage]}</p>
              <p>{Resources["termsUseText2"][currentLanguage]}</p>
              <p>{Resources["termsUseText3"][currentLanguage]}</p>
              <p>{Resources["termsUseText4"][currentLanguage]}</p>
              <p>{Resources["termsUseText5"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["userPostsTitle"][currentLanguage]}
              </h2>
              <p>{Resources["userPostsText1"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["ordersApprovalTitle"][currentLanguage]}
              </h2>
              <p>{Resources["ordersApprovalText1"][currentLanguage]}</p>
              <p>{Resources["ordersApprovalText2"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["trademarksTitle"][currentLanguage]}
              </h2>
              <p>{Resources["trademarksText"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["lawTitle"][currentLanguage]}
              </h2>
              <p>{Resources["lawText"][currentLanguage]}</p>
            </section>

            <section className="content-section mb-5">
              <h2 className="section-title">
                {Resources["terminationTitle"][currentLanguage]}
              </h2>
              <p>{Resources["terminationText1"][currentLanguage]}</p>
              <p>{Resources["terminationText2"][currentLanguage]}</p>
            </section>

            <footer className="text-center mt-5 pt-4 border-top">
              <p className="text-muted small">
                {Resources["allRightsReserved"][currentLanguage]}
              </p>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Terms;
