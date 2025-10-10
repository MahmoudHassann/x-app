import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSorted } from "../../redux/slices/filter-slice";
import Resources from "../../locales/Resources.json";
let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
  const sortOptions = [
    { label: Resources["New"][currentLanguage], value: "New" },
    { label: Resources["Sale"][currentLanguage], value: "Sale" },
    {
      label: Resources["Bestsellers"][currentLanguage],
      value: "Bestsellers",
    },
    {
      label: Resources["Low to High"][currentLanguage],
      value: "Low to High",
    },
    {
      label: Resources["High to Low"][currentLanguage],
      value: "High to Low",
    },
  ];
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
      <span className="gray_span">{Resources["sortBy"][currentLanguage]}</span>
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
 
        {sortOptions.find((option) => option.value === selectedSort)?.label}
      </button>
      <ul className="dropdown-menu parentFilterPanel">
        {sortOptions.map((option) => {
          const sanitizedId = option.value.replace(/\s+/g, "-");
          return (
            <li key={option.value}>
              <input
                type="radio"
                className="filterRadioBox"
                name="sortOption"
                id={sanitizedId}
                checked={selectedSort === option.value}
                value={option.value}
                onChange={handleSizeChange}
              />
              <label htmlFor={sanitizedId}>{option.label}</label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SortDropdown;
