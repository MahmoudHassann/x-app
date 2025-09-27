import { Link } from "react-router-dom";

import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import Resources from "../locales/Resources.json";

import { Suspense, useEffect,useState } from "react";
import { Pagination } from "swiper/modules";
import TopBar from "../components/TopBar";
import axios from "axios";

export default function Home() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";
  const [categories, setCategories] = useState([]);
  const getCategories = async () => {
    const response = await axios.get(
      "https://mister-x-store.com/mister_x_site/public/api/categories"
    );
    console.log(response.data.data, "resppnnse");
    setProducts(response.data.data);
  };
  useEffect(() => {
    getCategories();
  }, []);
  return (
    <main className="home">
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <TopBar />
        <header>
          <picture className="top-banner-image">
            <source
              media="(min-width: 1024px)"
              srcSet="/banner/top-banner/HOMEPAGE_DESKTOP.jpeg"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/banner/top-banner/HOMEPAGE_TABLET.jpeg"
            />
            <source
              media="(min-width: 0px)"
              srcSet="/banner/top-banner/HOMEPAGE_MOBILE.jpeg"
            />
            <img
              decoding="async"
              alt="a man in a hat and jacket standing in front of a mirror"
            />
          </picture>
          <div className="buttons">
            <Link to="shop">shop men</Link>
          </div>
        </header>
        <section className="new-arrivals">
          <div className="container-fluid px-5 py-4">
            <div className="special-head">
              <h2>Explore New Arrivals</h2>
            </div>

            <div className="filter-by">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <span>Filter by:</span>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="men-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#men-tab-pane"
                    type="button"
                    role="tab"
                    aria-controls="men-tab-pane"
                    aria-selected="true"
                  >
                    MEN
                  </button>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="men-tab-pane"
                  role="tabpanel"
                  aria-labelledby="men-tab"
                  tabIndex="0"
                >
                  <div className="collections">
                    <Suspense fallback={<h1>hello loading</h1>}>
                      <Swiper
                        slidesPerView={5}
                        preloadImages={false}
                        lazy={true}
                        spaceBetween={40}
                        pagination={{
                          clickable: true,
                        }}
                        modules={[Pagination]}
                        breakpoints={{
                          0: {
                            slidesPerView: 2,
                            spaceBetween: 20,
                          },
                          768: {
                            slidesPerView: 4,
                            spaceBetween: 30,
                          },
                          1024: {
                            slidesPerView: 5,
                            spaceBetween: 40,
                          },
                        }}
                      >
                        <SwiperSlide>
                          <div className="collection-box">
                            <img
                              loading="lazy"
                              src="./men/MEN_JEANS.jpeg"
                              alt=""
                            />
                            <div className="link">
                              <a href="#">JEANS</a>
                            </div>
                          </div>
                        </SwiperSlide>

                        <SwiperSlide>
                          <div className="collection-box">
                            <img
                              loading="lazy"
                              src="./men/MEN_T-SHIRTS.jpeg"
                              alt=""
                            />
                            <div className="link">
                              <a href="#">T-SHIRTS & TOPS</a>
                            </div>
                          </div>
                        </SwiperSlide>

                        <SwiperSlide>
                          <div className="collection-box">
                            <img
                              loading="lazy"
                              src="./men/MEN_SHIRTS.jpeg"
                              alt=""
                            />

                            <div className="link">
                              <a href="#">SHIRTS</a>
                            </div>
                          </div>
                        </SwiperSlide>
                        <SwiperSlide>
                          <div className="collection-box">
                            <img
                              loading="lazy"
                              src="./men/MEN_SWEATS.jpeg"
                              alt=""
                            />

                            <div className="link">
                              <a href="#">SWEATERS</a>
                            </div>
                          </div>
                        </SwiperSlide>

                        <SwiperSlide>
                          <div className="collection-box">
                            <img
                              loading="lazy"
                              src="./men/MEN_PANTS.jpeg"
                              alt=""
                            />

                            <div className="link">
                              <a href="#">PANTS</a>
                            </div>
                          </div>
                        </SwiperSlide>
                      </Swiper>
                    </Suspense>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
