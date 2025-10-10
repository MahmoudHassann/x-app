import React from "react";
import { useSelector } from "react-redux";
import Resources from "../locales/Resources.json";

let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";

const PrivacyPolicy = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);

  return (
    <section className="privacy-policy static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header className="my-5 text-center pt-5">
            <h1 className="main-title">
              {Resources["privacyPolicyTitle"][currentLanguage]}
            </h1>
          </header>

          <section className="content-section mb-5">
            <p>{Resources["privacyPolicyIntro"][currentLanguage]}</p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["informationWeCollect"][currentLanguage]}
            </h2>
            <p>{Resources["informationWeCollectText1"][currentLanguage]}</p>
           
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["howWeUseInformation"][currentLanguage]}
            </h2>
            <p>{Resources["howWeUseInformationText1"][currentLanguage]}</p>
           </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["competitions"][currentLanguage]}
            </h2>
            <p>{Resources["competitionsText"][currentLanguage]}</p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["thirdPartiesAndLinks"][currentLanguage]}
            </h2>
            <p>{Resources["thirdPartiesAndLinksText"][currentLanguage]}</p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["cookies"][currentLanguage]}
            </h2>
            <p>{Resources["cookiesText"][currentLanguage]}</p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["security"][currentLanguage]}
            </h2>
            <p>{Resources["securityText"][currentLanguage]}</p>
          </section>

          <section className="content-section mb-5">
            <h2 className="section-title">
              {Resources["customerRights"][currentLanguage]}
            </h2>
            <p>{Resources["customerRightsText"][currentLanguage]}</p>
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

export default PrivacyPolicy;
