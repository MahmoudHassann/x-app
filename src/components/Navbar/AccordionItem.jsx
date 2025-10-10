import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

const AccordionItem = ({ item, isActive, onToggle }) => {
  const [activeChild, setActiveChild] = useState(null);
  const categories = useSelector((state) => state.common.categories);

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

  const toggleChild = (childTitle, id) => {
    const newActiveChild = activeChild === childTitle ? null : childTitle;
    setActiveChild(newActiveChild);

    if (newActiveChild) {
      localStorage.setItem("activeSubItem", newActiveChild);

      window.location.href = `${window.location.origin}/shop?cat=${id}`;
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
    }
  };

  const handleLinkClick = (subItem) => {
    localStorage.setItem("activeItem", item.title);
    localStorage.setItem("activeSubItem", subItem);
  };

  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const catIdFromUrl = queryParams.get("cat");

    const activeItem = localStorage.getItem("activeItem");
    const activeSubItem = localStorage.getItem("activeSubItem");

    if (activeItem === item.title) {
      onToggle(true);
    }

    if (catIdFromUrl && categories.length > 0) {
      const matchedCategory = categories.find(
        (cat) => cat.cat_id.toString() === catIdFromUrl
      );
      if (matchedCategory) {
        setActiveChild(matchedCategory.cat_name);
        localStorage.setItem("activeSubItem", matchedCategory.cat_name);
      }
    } else if (activeSubItem) {
      setActiveChild(activeSubItem);
    }
  }, [location.search, categories]);
  return (
    <div className="accordion-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button child collapsed`}
          data-bs-toggle="collapse"
          type="button"
          aria-expanded={isActive}
          onClick={handleToggle}
        >
          {item.title}
        </button>
      </h2>
      <div className={`accordion-collapse collapse show  `}>
        <div className="accordion-body">
          {console.log(categories, "categories")}
          {categories && categories.length > 0 ? (
            <div className="accordion accordion-flush">
              {categories.map((cat, childIndex) => (
                <div
                  key={childIndex}
                  className="accordion-item child-accordion"
                >
                  <h3 className="accordion-header">
                    <button
                      className={`accordion-button child ${
                        activeChild === cat.cat_name ? "active" : "collapsed"
                      }`}
                      type="button"
                      aria-expanded={activeChild === cat.cat_name}
                      disabled={activeChild === cat.cat_name}
                      onClick={() => toggleChild(cat.cat_name, cat.cat_id)}
                    >
                      {cat.cat_name}
                    </button>
                  </h3>
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
