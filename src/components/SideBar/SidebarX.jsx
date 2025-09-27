import React, { useState } from "react";
import AccordionItem from "../Navbar/AccordionItem";

const SidebarX = ({ isOpen }) => {
  return <div className={`sidebar ${isOpen ? "show" : ""}`}></div>;
};

export default SidebarX;
