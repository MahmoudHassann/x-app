import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "jquery/dist/jquery.js";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "swiper/css";
import "swiper/css/pagination";

import "./sass/main.scss";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
// import "@/styles/globals.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
