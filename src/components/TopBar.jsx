import React from "react";
import Resources from "../locales/Resources.json";
let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
export default function TopBar(props) {
  const { isDark } = props;
  return (
    <div className={`top_bar ${isDark && "is_dark"}`}>
      <ul>
        <li>{Resources["springUpdate"][currentLanguage]}</li>
        <li>{Resources["freeShipping"][currentLanguage]}</li>
        <li>{Resources["60DayReturns"][currentLanguage]}</li>
      </ul>
    </div>
  );
}
