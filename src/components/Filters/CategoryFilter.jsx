import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../redux/slices/filter-slice";

const CategoryFilter = () => {
  let dispatch = useDispatch();
  const selectedCategories = useSelector((state) => state.filters.category);
  const handleCheckBoxChange = (event) => {
    const { name, checked } = event.target;

    let updatedCategoryFilters;
    if (checked) {
      updatedCategoryFilters = selectedCategories.includes(name)
        ? selectedCategories
        : [...selectedCategories, name];
    } else {
      updatedCategoryFilters = selectedCategories.filter(
        (category) => category !== name
      );
    }
    dispatch(setCategory(updatedCategoryFilters));
  };
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
        <li>
          <input
            type="checkbox"
            name="accessories"
            id="accessoriesCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="accessoriesCheckBox">Accessories</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="gift_Card"
            id="giftCardCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="giftCardCheckBox">Gift card</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="jackets_And_Blazers_Card"
            id="jacketsAndBlazersCardCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="jacketsAndBlazersCardCheckBox">
            Jackets & blazers
          </label>
        </li>

        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="jeans"
            id="jeansCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="jeansCheckBox">Jeans</label>
        </li>

        <li>
          <input
            type="checkbox"
            name="jumpstits_And_Overalls"
            id="jumpstitsAndOverallsCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="jumpstitsAndOverallsCheckBox">
            Jumpsuits & overalls
          </label>
        </li>

        <li>
          <input
            type="checkbox"
            name="knitwear"
            id="knitwearCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="knitwearCheckBox">Knitwear</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="pants"
            id="pantsCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="pantsCheckBox">Pants</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="shirts"
            id="shirtsCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="shirtsCheckBox">Shirts</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="shoes"
            id="shoesCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="shoesCheckBox">Shoes</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="shorts"
            id="shortsCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="shortsCheckBox">Shorts</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="sweats"
            id="sweatsCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="sweatsCheckBox">Sweats</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="swimwear"
            id="swimwearCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="swimwearCheckBox">Swimwear</label>
        </li>
        <li>
          <input
            type="checkbox"
            className="filterCheckBox"
            name="T-shirts"
            id="tShirtsCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="tShirtsCheckBox">T-shirts</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="underwear"
            id="underwearCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="underwearCheckBox">Underwear</label>
        </li>
      </ul>
    </div>
  );
};

export default CategoryFilter;
