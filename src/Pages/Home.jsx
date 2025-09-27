// Home.jsx
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import TopBar from "../components/TopBar";
import axios from "axios";
import { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";

export default function Home() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  const baseImageUrl = "https://mister-x-store.com/mister_x_site/public/imgs/";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://mister-x-store.com/mister_x_site/public/api/categories"
      );
      setCategories(response.data?.data ?? []);
    } catch (e) {
      setError("حدث خطأ أثناء تحميل التصنيفات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

 
  useEffect(() => {
    if (!loading && categories.length) {
      console.log(
        "sample imgs:",
        categories.slice(0, 3).map((c) => `${baseImageUrl}${c.cat_img}`)
      );
    }
  }, [loading, categories]);

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
                
                    {!loading && categories.length > 0 && (
                      <Swiper
                        key={categories.length}
                        slidesPerView={4} 
                        spaceBetween={20}
                        pagination={{ clickable: true }}
                        modules={[Pagination]}
                        observer
                        observeParents
                        breakpoints={{
                          0: { slidesPerView: 1, spaceBetween: 12 },
                          768: { slidesPerView: 4, spaceBetween: 16 },
                          1024: { slidesPerView: 4, spaceBetween: 20 },
                        }}
                      >
                        {categories.map((category) => {
                          const id =
                            category.id ?? category.cat_id ?? category.cat_name;
                          const name = category.cat_name || "Category";
                          const src = `${baseImageUrl}${category.cat_img}`;
                          return (
                            <SwiperSlide key={id} className="mx-slide">
                              <div className="collection-box">
                                <img
                                  className="collection-img"
                                  loading="lazy"
                                  src={src}
                                  alt={name}
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.jpg";
                                  }}
                                />
                                <div className="link">
                                  <Link
                                    to={`/shop?cat=${encodeURIComponent(id)}`}
                                  >
                                    {name}
                                  </Link>
                                </div>
                              </div>
                            </SwiperSlide>
                          );
                        })}
                      </Swiper>
                    )}

                  
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
