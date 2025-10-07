import axios from "axios";
import React, { useEffect, useState } from "react";
import { MainLoading } from "../components/Loading/MainLoading";
import { useSelector } from "react-redux";
import TopBar from "../components/TopBar";
import Resources from "../locales/Resources.json";
let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
export default function Stores() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  const [isLoading, setIsLoading] = useState(false);
  const [stores, setStores] = useState([]);
  const getAllStores = async () => {
    setIsLoading(true);
    const response = await axios.get(
      `https://mister-x-store.com/mister_x_site/public/api/branches`
    );
    if (response && response.data.data) {
      setStores(response.data.data);
      setIsLoading(false);
    }
    setIsLoading(false);
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
                        <span class="store-badge">Main</span>
                      </div>
                      <div class="store-content">
                        <h3 class="store-title">{store.br_name}</h3>
                        <div class="store-info">
                          <i class="fas fa-map-marker-alt"></i>
                          <div class="store-info-text">{store.br_location}</div>
                        </div>

                        <div class="store-info">
                          <i class="fas fa-phone"></i>
                          <div class="store-info-text">+20 2 1234 5678</div>
                        </div>
                      </div>
                      <div class="store-footer">
                        <a
                          href={store.br_link}
                          target="_blank"
                          class="btn-store btn-primary"
                        >
                          <i class="fas fa-directions"></i>
                          Directions
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <section class="stats-section">
              <div class="row">
                <div class="col-md-4">
                  <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">branch</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <div class="stat-number">15</div>
                    <div class="stat-label">Country</div>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stat-item">
                    <div class="stat-number">24/7</div>
                    <div class="stat-label">Customer service</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </>
  );
}

// <section class="stores-section">
//     <div class="container">
//         <div class="row">

//             <div class="col-lg-4 col-md-6">
//                 <div class="store-card">
//                     <div class="store-image">
//                         <i class="fas fa-store"></i>
//                         <span class="store-badge">رئيسي</span>
//                     </div>
//                     <div class="store-content">
//                         <h3 class="store-title">فرع القاهرة - التحرير</h3>
//                         <div class="store-info">
//                             <i class="fas fa-map-marker-alt"></i>
//                             <div class="store-info-text">
//                                 شارع التحرير، ميدان التحرير<br>
//                                 القاهرة، مصر
//                             </div>
//                         </div>
//                         <div class="store-info">
//                             <i class="fas fa-clock"></i>
//                             <div class="store-info-text">
//                                 السبت - الخميس: 10:00 ص - 10:00 م
//                             </div>
//                         </div>
//                         <div class="store-info">
//                             <i class="fas fa-phone"></i>
//                             <div class="store-info-text">
//                                 +20 2 1234 5678
//                             </div>
//                         </div>
//                     </div>
//                     <div class="store-footer">
//                         <a href="https://maps.google.com/?q=Cairo,Egypt" target="_blank" class="btn-store btn-primary">
//                             <i class="fas fa-directions"></i>
//                             الاتجاهات
//                         </a>
//                         <button class="btn-store btn-secondary">
//                             <i class="fas fa-info-circle"></i>
//                             التفاصيل
//                         </button>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     </div>
// </section>
