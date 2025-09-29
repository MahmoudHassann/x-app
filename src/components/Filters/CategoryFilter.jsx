import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slices/filter-slice";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const CategoryFilter = () => {
  const dispatch = useDispatch();
  const selectedCategories =
    useSelector((state) => state.filters.category) || [];
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const catId = queryParams.get("cat");
  const handleCheckBoxChange = (event) => {
    const { value, checked } = event.target;
    const val = String(value);

    let updatedCategoryFilters;

    if (checked) {
      updatedCategoryFilters = selectedCategories.includes(val)
        ? selectedCategories
        : [...selectedCategories, val];
    } else {
      updatedCategoryFilters = selectedCategories.filter((c) => c !== val);

      if (val === catId) {
        queryParams.delete("cat");
        navigate({
          pathname: location.pathname,
          search: queryParams.toString(),
        });
      }
    }

    dispatch(setCategory(updatedCategoryFilters));
  };

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCategories = async () => {
    try {
      const response = await axios.get(
        "https://mister-x-store.com/mister_x_site/public/api/categories"
      );
      setCategories(response.data?.data ?? []);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    
    return () => {
      dispatch(setCategory([]));  
    };
  }, []);
  useEffect(() => {
    getCategories();
  }, []);

  if (loading) return <div className="by-category">Loading...</div>;

  return (
    <div className="by-category">
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
        {categories.map((category) => {
          const value = String(category.cat_id);
          const checked = selectedCategories.includes(value);
          return (
            <li key={value} className="px-3 py-1">
              <input
                type="checkbox"
                value={value}
                name={category.cat_name}
                id={`${category.cat_name}CheckBox`}
                className="filterCheckBox me-2"
                checked={checked}
                onChange={handleCheckBoxChange}
              />
              <label htmlFor={`${category.cat_name}CheckBox`}>
                {category.cat_name}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CategoryFilter;
