import React from "react";
import { useSelector } from "react-redux";

const Shipping = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);
  return (
    <section className="refund static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header class="my-5 text-center pt-5">
            <h1 class="main-title">سياسة الشحن</h1>
          </header>

          <section class="content-section mb-5">
            <p class="intro-text">
              يعد تأكيد عملية الشراء، نقوم بشحن وإرسال المنتج عبر الطريقة التي
              تقدم باختيارها، إما عبر مسؤول الشحن الخاص بنا أو عبر خدمة أمانة
              إكسبريس.
            </p>
          </section>

          <section class="content-section mb-5">
            <h2 class="section-title">طرق الشحن:</h2>
            <p>
              أمانة إكسبريس: خدمة تصمر لكم تسليم الإرساليات إلى العنوان المطلوب
              في مدة تتراوح بين 3 أيام و 7 أيام حوالاتجاهات الإنتسيبة.
            </p>

            <p>
              مسؤول الشحن: متبردنا نتعاقد مع مجموعة من مسؤولي الشحن بمجموعة من
              المدن يقومون بإيصال المنتجات في مدة تتراوح بين يوم و3 أيام.
            </p>
          </section>

          <footer class="text-center mt-5 pt-4 border-top">
            <p class="text-muted small">© 2025 جميع الحقوق محفوظة ل MISTER-X</p>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Shipping;
