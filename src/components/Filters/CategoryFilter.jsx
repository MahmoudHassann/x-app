import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slices/filter-slice";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoryFilter = () => {
  let dispatch = useDispatch();
  const selectedCategories = useSelector((state) => state.filters.category);
  const handleCheckBoxChange = (event) => {
    const { value, checked } = event.target;

    let updatedCategoryFilters;
    if (checked) {
      updatedCategoryFilters = selectedCategories.includes(value)
        ? selectedCategories
        : [...selectedCategories, value];
    } else {
      updatedCategoryFilters = selectedCategories.filter(
        (category) => category !== value
      );
    }
    dispatch(setCategory(updatedCategoryFilters));
  };

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://mister-x-store.com/mister_x_site/public/api/categories"
      );
      console.log(response, "responseresponseresponseresponse");
      setCategories(response.data?.data ?? []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="by-category">
      {console.log("hehehe")}
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="categoryDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Category
      </button>
      <ul
        className="dropdown-menu dropdown-menu-start parentFilterPanel"
        aria-labelledby="categoryDropdown"
      >
        {categories.map((category) => (
          <li>
            <input
              type="checkbox"
               value={category.cat_id}
                name={category.cat_name}
              id={`${category.cat_name}CheckBox`}
              className="filterCheckBox"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor={`${category.cat_name}CheckBox`}>{category.cat_name}</label>
          </li>
        ))}
        
      </ul>
    </div>
  );
};

export default CategoryFilter;
