import React, { useEffect, useState } from "react";
import { MainLoading } from "../components/Loading/MainLoading";
import { useSelector } from "react-redux";
import TopBar from "../components/TopBar";
import Resources from "../locales/Resources.json";
import Api from "../dependencies/instanceAxios";
let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
export default function Stores() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const getAllStores = async () => {
    setIsLoading(true);

    const response = await Api.get("branches");

    if (response && response.data.data) {
      setStores(response.data.data);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllStores();
  }, []);

  return (
    <>
      {isLoading && <MainLoading />}
      <section className="stores">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <TopBar isDark={true} />

          <div className="container">
            <div className={`head_section my-4`}>
              <h1 className="basic_title">
                {Resources["FindAStores"][currentLanguage]}
              </h1>
            </div>

            <section class="stores-section">
              <div class="row">
                {stores.map((store, index) => (
                  <div class="col-lg-4 col-md-6">
                    <div class="store-card">
                      <div class="store-image">
                        <i class="fas fa-store"></i>
                        {/* <span class="store-badge">Main</span> */}
                      </div>
                      <div class="store-content">
                        <h3 class="store-title">{store.br_name}</h3>
                        <div class="store-info">
                          <i class="fas fa-map-marker-alt"></i>
                          <div class="store-info-text">{store.br_location}</div>
                        </div>

                        <div class="store-info">
                          <i class="fas fa-phone"></i>
                          <div class="store-info-text">{store.br_phone}</div>
                        </div>
                      </div>
                      <div class="store-footer">
                        <a
                          href={store.br_link}
                          target="_blank"
                          class="btn-store btn-primary"
                        >
                          <i class="fas fa-directions"></i>
                          {Resources["directions"][currentLanguage]}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}
