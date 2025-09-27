import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSorted } from "../../redux/slices/filter-slice";

const SortDropdown = () => {
  const dispatch = useDispatch();
  const sorted = useSelector((state) => state.filters.sortedBy);
  const [selectedSort, setSelectedSort] = useState(sorted || "New");

  const handleSizeChange = (event) => {
    const selectedSort = event.target.value;
    setSelectedSort(selectedSort);
    dispatch(setSorted(selectedSort));
  };

  useEffect(() => {
    setSelectedSort(sorted || "New");
  }, [sorted]);

  return (
    <div className="sort">
      <span className="gray_span">Sort by:</span>
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedSort}
      </button>
      <ul className="dropdown-menu parentFilterPanel">
        {[
        
          "New",
          "Sale",
          "Bestsellers",
          "Low to High",
          "High to Low",
        ].map((option) => {
          const sanitizedId = option.replace(/\s+/g, "-");
          return (
            <li key={option}>
              <input
                type="radio"
                className="filterRadioBox"
                name="sortOption"
                id={sanitizedId}
                checked={selectedSort === option}
                value={option}
                onChange={handleSizeChange}
              />
              <label htmlFor={sanitizedId}>{option}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SortDropdown;
