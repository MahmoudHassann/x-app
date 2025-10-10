import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout(props) {
  return (
    <>
      <Navbar categories={props.categories} />
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
}
