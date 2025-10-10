import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import "./App.css";
import Layout from "./Pages/Layout";
import LayoutWithoutFooter from "./Pages/LayoutWithoutFooter.jsx";
import ProtectedRoute from "./components/helpers/ProtectedRoute.jsx";
import ScrollToTop from "./components/helpers/ScrollToTop.jsx";
import { MainLoading } from "./components/Loading/MainLoading.jsx";
 
import PrivacyPolicy from "./Pages/PrivacyPolicy.jsx";
import Terms from "./Pages/Terms.jsx";
import Refund from "./Pages/Refund.jsx";
import Shipping from "./Pages/Shipping.jsx";
import { useDispatch } from "react-redux";
import { fetchCategories } from "./redux/slices/common-slice.js";

const Home = lazy(() => import("./Pages/Home"));
const Shop = lazy(() => import("./Pages/Shop"));
const Stores = lazy(() => import("./Pages/Stores"));

const Register = lazy(() => import("./components/Auth/Register"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const CheckOut = lazy(() => import("./Pages/CheckOut"));
const OrderDetails = lazy(() => import("./Pages/OrderDetails"));
const SearchPage = lazy(() => import("./components/Search/SearchPage"));
function App() {
  const dispatch = useDispatch();
  const currentLang = localStorage.getItem("language") || "en";
  useEffect(() => {
    if (currentLang === "ar") {
      document.documentElement.lang = "ar";
      document.documentElement.dir = "rtl";
    } else {
      document.documentElement.lang = "en";
      document.documentElement.dir = "ltr";
    }
  }, [currentLang]);
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  const routes = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "", element: <Home /> },
        { path: "shop", element: <Shop /> },
        { path: "stores", element: <Stores /> },
        { path: "privacy-policy", element: <PrivacyPolicy /> },
        { path: "terms", element: <Terms /> },
        { path: "refund", element: <Refund /> },
        { path: "shipping", element: <Shipping /> },
        { path: "search", element: <SearchPage /> },
       

        {
          path: "register",
          element: (
            <ProtectedRoute isCanGo={true} redirectTo="/">
              <Register />
            </ProtectedRoute>
          ),
        },

        { path: "shop/product/:id", element: <ProductDetails /> },
        { path: "*", element: <NotFound /> },
      ],
    },

    {
      path: "/checkout",
      element: <LayoutWithoutFooter />,
      children: [
        { path: "shopping-bag", element: <CheckOut /> },
        { path: "order-details", element: <OrderDetails /> },
      ],
    },
  ];
  return (
    <>
      <Router basename="/">
        <ScrollToTop />
        <Suspense fallback={<MainLoading />}>
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children &&
                  route.children.map((childRoute, childIndex) => (
                    <Route
                      key={childIndex}
                      path={childRoute.path}
                      element={childRoute.element}
                    />
                  ))}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </Router>
    </>
  );
}

export default App;
