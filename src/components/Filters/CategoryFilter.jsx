import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slices/filter-slice";
import { useLocation, useNavigate } from "react-router-dom";
import Resources from "../../locales/Resources.json";
let currentLanguage = localStorage.getItem("language")
  ? localStorage.getItem("language")
  : "en";
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

  const categories = useSelector((state) => state.common.categories);

  return (
    <div className="by-category">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="categoryDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {Resources["category"][currentLanguage]}
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
