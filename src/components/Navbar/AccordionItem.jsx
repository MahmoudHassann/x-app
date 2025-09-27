import React, { useState, useEffect } from "react";

const AccordionItem = ({ item, isActive, onToggle }) => {
  const [activeChild, setActiveChild] = useState(null);

  useEffect(() => {
    const activeItem = localStorage.getItem("activeItem");
    const activeSubItem = localStorage.getItem("activeSubItem");

    if (activeItem === item.title) {
      onToggle(true);
      if (activeSubItem) {
        setActiveChild(activeSubItem);
      }
    }
  }, []);

  const toggleChild = (childTitle) => {
    const newActiveChild = activeChild === childTitle ? null : childTitle;
    setActiveChild(newActiveChild);

    if (newActiveChild) {
      localStorage.setItem("activeSubItem", newActiveChild);
    } else {
      localStorage.removeItem("activeSubItem");
    }
  };

  const handleToggle = () => {
    onToggle();
    if (!isActive) {
      localStorage.setItem("activeItem", item.title);
    } else {
      localStorage.removeItem("activeItem");
      localStorage.removeItem("activeSubItem");
      setActiveChild(null);
    }
  };

  const handleLinkClick = (subItem) => {
    localStorage.setItem("activeItem", item.title);
    localStorage.setItem("activeSubItem", subItem);
  };

  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button ${isActive ? "" : "collapsed"}`}
          data-bs-toggle="collapse"
          type="button"
          aria-expanded={isActive}
          onClick={handleToggle}
        >
          {item.title}
        </button>
      </h2>
      <div className={`accordion-collapse collapse ${isActive ? "show" : ""}`}>
        <div className="accordion-body">
          {item.children && item.children.length > 0 ? (
            <div className="accordion accordion-flush">
              {item.children.map((child, childIndex) => (
                <div
                  key={childIndex}
                  className="accordion-item child-accordion"
                >
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button ${
                        activeChild === child.title ? "active" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeChild === child.title}
                      onClick={() => toggleChild(child.title)}
                    >
                      {child.title}
                    </button>
                  </h3>
                  <div
                    className={`accordion-collapse collapse ${
                      activeChild === child.title ? "show" : ""
                    }`}
                  >
                    <div className="accordion-body child-accordion-body">
                      <ul>
                        {child.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a
                              href={`#${subItem
                                .toLowerCase()
                                .replace(" ", "-")}`}
                              onClick={() => handleLinkClick(child.title)}
                            >
                              {subItem}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No subcategories available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionItem;
