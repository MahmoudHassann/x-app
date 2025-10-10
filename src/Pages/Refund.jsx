import React from "react";
import { useSelector } from "react-redux";

const Refund = () => {
  const isOpen = useSelector((state) => state.layout.navOpen);
  return (
    <section className="refund static-page-section">
      <div className="container">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <header class="my-5 text-center pt-5">
            <h1 class="main-title">سياسة الاستبدال و الاسترجاع</h1>
          </header>

          <section class="content-section mb-5">
            <ul class="policy-list">
              <li>
                الإستبدال والإسترجاع حق مضمون لكل عملائنا وهو يشمل جميع المنتجات
                التي نعرضها على متجرنا.
              </li>

              <li>
                جميع المنتجات المعروضة على متجرنا قابلة لسياسة الإستبدال
                والإسترجاع وفق الشروط والأحكام المنصوص عليها في هذه الصفحة.
              </li>

              <li>
                يمكن الإرجاع أو الإستبدال إذا كان المنتج بنفس حالة الأصلية عند
                الشراء ومعافا بالغلاف الأصلي.
              </li>

              <li>
                يتم الموافقة على طلب الإستبدال أو الإسترجاع خلال 3 أيام عمل.
              </li>

              <li>
                في حالة الموافقة على طلب الإسترجاع والإستبدال المندوب يصل للعميل
                خلال 3-5 أيام عمل.
              </li>

              <li>
                يرجى إرسال رسالة عبر تطبيق أو Whatsapp الرقم الموضح في بوليصة
                الشحن من أجل طلب الإسترجاع أو الإستبدال أو التواصل معنا عبر صفحة
                اتصل بنا من أجل طلب الاسترجاع أو الإسترداد.
              </li>

              <li>
                يرجى تصوير المنتج وإرساله مع تحديد المدينة والعنوان ورقم الطلب
                لنتم إستداله منتج أدمر حي حالة كان المنتج مااسداً أو به عيب
                معين، أو لا يتتعل وفق المتفق عليه.
              </li>

              <li>
                يتم إسترجاع المبلغ للعميل كاملاً في حالة كان المنتج الذي توصل به
                مختلف تماماً مع وصف المنتج في صفحة المنتج بموقعنا.
              </li>

              <li>
                لسنا مسؤولين عن أي توقعات لإستعمال المنتجات من طرف العميل لم
                تذكرها بصفحة المنتج بموقعنا.
              </li>
            </ul>
          </section>

          <footer class="text-center mt-5 pt-4 border-top">
            <p class="text-muted small">© 2025 جميع الحقوق محفوظة ل MISTER-X</p>
          </footer>
        </div>
      </div>
    </section>
  );
};

export default Refund;
