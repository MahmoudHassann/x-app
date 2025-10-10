import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { navOpen } from "../../redux/slices/layout-slice";
import Resources from "../../locales/Resources.json";
import { Link, NavLink } from "react-router-dom";
import {
  calcTotalItems,
  removeItemCart,
  updateTotalAmount,
} from "../../redux/slices/cart-slice";
import AccordionItem from "./AccordionItem";
import SearchBar from "../Search/SearchBar";
import products from "../../json/products";
export default function Navbar(props) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);
  const isNavOpen = useSelector((state) => state.layout.navOpen);
  const [activeItem, setActiveItem] = useState(null);

  useEffect(() => {
    const storedNavOpen = localStorage.getItem("navOpen");
    if (storedNavOpen !== null) {
      dispatch(navOpen(JSON.parse(storedNavOpen)));
    }
  }, [dispatch]);
  const handleClick = () => {
    const newNavOpenState = !isNavOpen;
    dispatch(navOpen(newNavOpenState));
    localStorage.setItem("navOpen", JSON.stringify(newNavOpenState));
  };

  let cartData = useSelector((state) => state.cart.cartItems);
  let subTotal = useSelector((state) => state.cart.subTotal);
  let tax = useSelector((state) => state.cart.tax);
  let totalAmount = useSelector((state) => state.cart.totalAmount);
  let totalCartItems = useSelector((state) => state.cart.totalItems);

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(results);
  }, [searchQuery]);

  const handleLang = (e) => {
    localStorage.setItem("language", e.target.value);
    window.location.reload();
  };
  let currentLanguage = localStorage.getItem("language")
    ? localStorage.getItem("language")
    : "en";

  useEffect(() => {
    dispatch(calcTotalItems());
    dispatch(updateTotalAmount());
  }, [dispatch]);
  const [isParentOpen, setIsParentOpen] = useState(false);

  const toggleParentAccordion = () => {
    setIsParentOpen((prev) => !prev);
  };

  const toggleItem = (item) => {
    setActiveItem(activeItem === item ? null : item);
  };
  const menuItems = [
    {
      title: Resources["men"][currentLanguage],
      children: [
        { title: "T-shirts", items: [] },
        { title: "Jeans", items: [] },
        { title: "Shoes", items: [] },
      ],
    },
  ];
  useEffect(() => {
    if (!isParentOpen) {
      document
        .querySelectorAll(".child-accordion .accordion-collapse")
        .forEach((element) => {
          element.classList.remove("show");
        });
    }
  }, [isParentOpen]);

  return (
    <>
      <nav>
        <div className="nav-container">
          <div className="nav-left">
            <div
              onClick={handleClick}
              className={`bars-container ${isNavOpen ? "change" : ""}`}
            >
              <div className="bar"></div>
              <div className="bar"></div>
              <div className="bar"></div>
            </div>

            <div className="links">
              <ul>
                <li>
                  <NavLink
                    to="/shop"
                    className={({ isActive }) =>
                      isActive ? "active-link" : "navLink"
                    }
                  >
                    {Resources["shop"][currentLanguage]}
                  </NavLink>
                </li>
              </ul>
            </div>
            <div className="search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
          </div>
          <div className="nav-center">
            <h1 className="logo">
              <Link to={"/"}>
                <img style={{ width: "40px" }} src="logo.png" alt="logo" />
              </Link>
            </h1>
            <SearchBar setSearchQuery={setSearchQuery} />
          </div>
          <div className="nav-right">
            <div className="search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </div>
            <div className="language">
              <i className="fa-solid fa-globe"></i>
              <select onChange={(e) => handleLang(e)}>
                <option value="en" selected={currentLanguage === "en"}>
                  {Resources["english"][currentLanguage]}
                </option>
                <option value="ar" selected={currentLanguage === "ar"}>
                  {Resources["arabic"][currentLanguage]}
                </option>
              </select>
            </div>

            <div className="cart">
              <Link className="shopping-cart">
                <Link className={"cart_icon"} to={"/checkout/shopping-bag"}>
                  <i className="fa-solid fa-cart-shopping"></i>{" "}
                  <span>{totalCartItems >= 100 ? `99+` : totalCartItems}</span>
                </Link>

                <div className="shopping_cart_panel">
                  <div className="wrapper">
                    {cartData.length > 0 && (
                      <>
                        <div className="header">
                          {Resources["itemsNotReserved"][currentLanguage]}{" "}
                          <span>
                            {
                              Resources["checkoutNowToMakeThemYours"][
                                currentLanguage
                              ]
                            }
                          </span>
                        </div>
                        <ul className="cart_product">
                          {cartData?.map((productCart, index) => (
                            <li className="product" key={index}>
                              <span
                                onClick={() => {
                                  if (
                                    productCart.selectedLength &&
                                    productCart.selectedWaist
                                  ) {
                                    dispatch(
                                      removeItemCart({
                                        id: productCart.id,
                                        waist: productCart.selectedWaist,
                                        length: productCart.selectedLength,
                                        color: productCart.selectedColor,
                                      })
                                    );
                                  } else {
                                    dispatch(
                                      removeItemCart({
                                        id: productCart.id,
                                        size: productCart.selectedSize,
                                        color: productCart.selectedColor,
                                      })
                                    );
                                  }
                                }}
                                className="remove_product"
                              >
                                <i className="fa-solid fa-xmark"></i>
                              </span>
                              <div className="image">
                                <img
                                  src={
                                    productCart.colorPanel.find(
                                      (color) =>
                                        color.color ===
                                        productCart.selectedColor
                                    )?.colorImage || ""
                                  }
                                  alt={productCart.name}
                                />
                              </div>
                              <div className="details">
                                <div className="head">
                                  <p className="product_name">
                                    {productCart.name}
                                  </p>
                                  <p className="product_price">
                                    {productCart.price}
                                  </p>
                                </div>
                                <div className="bottom">
                                  <p>
                                    {productCart.category[0]} /{" "}
                                    {productCart.selectedColor} /{" "}
                                    {productCart.category[0] === "Pants"
                                      ? `W${productCart.selectedWaist} L${productCart.selectedLength}`
                                      : `${productCart.selectedSize}`}{" "}
                                    / {productCart.quantity}
                                  </p>
                                </div>
                              </div>
                            </li>
                          ))}
                          <div className="line_section"></div>
                        </ul>
                        <div className="price_details">
                          <div className="sub_details">
                            <ul>
                              <li>
                                <p className="name">
                                  {Resources["subtotal"][currentLanguage]}
                                </p>
                                <p className="data">{subTotal}</p>
                              </li>

                              <li>
                                <p className="name">
                                  {Resources["tax"][currentLanguage]}
                                </p>
                                <p className="data">{tax}</p>
                              </li>
                              <li className="total">
                                <div className="name">
                                  {Resources["total"][currentLanguage]}
                                </div>
                                <div className="data">{totalAmount}</div>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}

                    {!cartData.length > 0 && (
                      <>
                        <p className="cart_empty">your shopping bag is empty</p>
                        <Link className="large_link" to={"/shop"}>
                          containue shopping
                        </Link>
                      </>
                    )}

                    {cartData.length > 0 && (
                      <Link
                        className="large_link"
                        to={"/checkout/shopping-bag"}
                      >
                        {Resources["proceedToCheckout"][currentLanguage]}
                      </Link>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className={`sidebar ${isNavOpen ? "show" : ""} `}>
        <div className="accordion accordion-flush" id="accordionFlushSidebar">
          {menuItems.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isActive={activeItem === item.title}
              onToggle={() => toggleItem(item.title)}
              categories={props.categories}
            />
          ))}
        </div>
      </div>
    </>
  );
}
