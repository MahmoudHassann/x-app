import { useSelector } from "react-redux";

export default function Footer() {
  const isOpen = useSelector((state) => state.layout.navOpen);

  return (
    <footer>
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <div className="linklist-panel">
          <div className="linklist">
            <h2>Outfits</h2>
            <div className="linklist-list">
              <a href="#">About G-Star</a>
              <a href="#">Jeans Fit Guide</a>
              <a href="#">Careers</a>
              <a href="#">Coroprate Responsibility</a>
              <a href="#">GSRD Foundation</a>
              <a href="#">G-Star Rewear</a>
              <a href="#">RAW Certified Tailors</a>
              <a href="#">Club-G</a>
              <a href="#">Newsletter</a>
              <a href="#">Gift Cards</a>
              <a href="#">Press Room</a>
            </div>
          </div>
          <div className="linklist">
            <h2>INFO</h2>
            <div className="linklist-list">
              <a href="#">Track my order</a>
              <a href="#">FAQ</a>
              <a href="#">Terms & Conditions</a>
              <a href="#">Privacy Policy</a>
              <a href="#">Cookie Statement</a>
              <a href="#">Website terms of use</a>
              <a href="#">Brand Protection</a>
              <a href="#">Sitemap</a>
              <a href="#">Complaints</a>
              <a href="#">Unidays</a>
            </div>
          </div>
          <div className="linklist">
            <h2>STORE LOCATOR</h2>

            <div className="linklist-list">
              <a className="find-store" href="#">
                find a store
              </a>
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
                  mister-x
                </button>
              </h2>
              <div
                id="flush-collapseOne"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    <a href="#">About G-Star</a>
                    <a href="#">Jeans Fit Guide</a>
                    <a href="#">Careers</a>
                    <a href="#">Coroprate Responsibility</a>
                    <a href="#">GSRD Foundation</a>
                    <a href="#">G-Star Rewear</a>
                    <a href="#">RAW Certified Tailors</a>
                    <a href="#">Club-G</a>
                    <a href="#">Newsletter</a>
                    <a href="#">Gift Cards</a>
                    <a href="#">Press Room</a>
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
                  INFO
                </button>
              </h2>
              <div
                id="flush-collapseTwo"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    <a href="#">Track my order</a>
                    <a href="#">FAQ</a>
                    <a href="#">Terms & Conditions</a>
                    <a href="#">Privacy Policy</a>
                    <a href="#">Cookie Statement</a>
                    <a href="#">Website terms of use</a>
                    <a href="#">Brand Protection</a>
                    <a href="#">Sitemap</a>
                    <a href="#">Complaints</a>
                    <a href="#">Unidays</a>
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
                  STORE LOCATOR
                </button>
              </h2>
              <div
                id="flush-collapseThree"
                className="accordion-collapse collapse"
                data-bs-parent="#accordionFlushExample"
              >
                <div className="accordion-body">
                  <div className="linklist-list">
                    <a className="find-store" href="#">
                      find a store
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ul className="links">
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
          <li>
            <a href="#"></a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
