import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Api = axios.create({
  baseURL: "https://e-ccomerce.vercel.app/api/v1/",
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      console.log(decodedToken, "decodedToken from Interceptors");

      if (decodedToken.exp < currentTime) {
        console.log("Token is expired");
        localStorage.removeItem("token");
      } else {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Token is valid", token);
        console.log(decodedToken.exp, "decodedToken.exp");
        console.log(currentTime, "currentTime");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default Api;
