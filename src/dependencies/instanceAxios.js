import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Api = axios.create({
  baseURL: "https://mister-x-store.com/mister_x_site/public/api/",
});

Api.interceptors.request.use(
  (config) => {
    const lang = localStorage.getItem("language") || "en";
    config.headers["Accept-Language"] = lang;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;
