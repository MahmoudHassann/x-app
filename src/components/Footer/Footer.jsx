import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Resources from "../../locales/Resources.json";

let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
export default function Footer() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  const categories = useSelector((state) => state.common.categories);

  return (
    <footer>
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <div className="linklist-panel">
          <div className="linklist">
            <h2>{Resources["Categories"][currentLanguage]}</h2>

            <div className="linklist-list">
              {categories.map((cat) => (
                <a href={`shop?cat=${cat.cat_id}`}>{cat.cat_name}</a>
              ))}
            </div>
          </div>
          <div className="linklist">
            <h2> {Resources["Info"][currentLanguage]}</h2>
            <div className="linklist-list">
              <Link to="privacy-policy">
                {Resources["privacyPolicyTitle"][currentLanguage]}
              </Link>
              <Link to="terms">
                {Resources["termsOfUseTitle"][currentLanguage]}
              </Link>
              <Link to="refund">
                {Resources["refundPolicyTitle"][currentLanguage]}
              </Link>
              <Link to="shipping">
                {Resources["shippingPolicyTitle"][currentLanguage]}
              </Link>
            </div>
          </div>
          <div className="linklist">
            <h2> {Resources["storeLocator"][currentLanguage]}</h2>

            <div className="linklist-list">
              <Link className="find-store" to="stores">
                {Resources["FindAStores"][currentLanguage]}
              </Link>
            </div>
          </div>
        </div>
        <div className="mobile-linklist">
          <div className="accordion accordion-flush" id="accordionFlushExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseOne"
                  aria-expanded="false"
                  aria-controls="flush-collapseOne"
                >
                  {Resources["Categories"][currentLanguage]}
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    {categories.map((cat) => (
                      <a href={`shop?cat=${cat.cat_id}`}>{cat.cat_name}</a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseTwo"
                  aria-expanded="false"
                  aria-controls="flush-collapseTwo"
                >
                  {Resources["Info"][currentLanguage]}
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    <Link to="privacy-policy">
                      {Resources["privacyPolicyTitle"][currentLanguage]}
                    </Link>
                    <Link to="terms">
                      {Resources["termsOfUseTitle"][currentLanguage]}
                    </Link>
                    <Link to="refund">
                      {Resources["refundPolicyTitle"][currentLanguage]}
                    </Link>
                    <Link to="shipping">
                      {Resources["shippingPolicyTitle"][currentLanguage]}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#flush-collapseThree"
                  aria-expanded="false"
                  aria-controls="flush-collapseThree"
                >
                  {Resources["storeLocator"][currentLanguage]}
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    <Link className="find-store" to="stores">
                      {Resources["FindAStores"][currentLanguage]}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ul className="links">
          <li>
            <a
              target="_blank"
              href="https://www.facebook.com/mister.x112"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.instagram.com/mister.x1122/?__pwa=1#"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
          </li>
          <li>
            <a
              target="_blank"
              href="https://www.tiktok.com/@mister.xxxx1"
              rel="noopener noreferrer"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
