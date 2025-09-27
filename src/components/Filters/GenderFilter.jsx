import { useDispatch, useSelector } from "react-redux";
import { setGender } from "../../redux/slices/filter-slice";

const GenderFilter = ({ setFilters }) => {
  const dispatch = useDispatch();
  const selectedGenders = useSelector((state) => state.filters.gender);

  const handleCheckBoxChange = (event) => {
    const { name, checked } = event.target;

    let updatedGenderFilters;
    if (checked) {
      updatedGenderFilters = selectedGenders.includes(name)
        ? selectedGenders
        : [...selectedGenders, name];
    } else {
      updatedGenderFilters = selectedGenders.filter(
        (gender) => gender !== name
      );
    }

    dispatch(setGender(updatedGenderFilters));
  };

  return (
    <div className="by-gender">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        id="genderDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Gender
      </button>
      <ul
        className="dropdown-menu parentFilterPanel dropdown-menu-start"
        aria-labelledby="genderDropdown"
      >
        <li>
          <input
            type="checkbox"
            name="men"
            id="menCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="menCheckBox">Men</label>
        </li>
        <li>
          <input
            disabled
            type="checkbox"
            name="women"
            id="womenCheckBox"
            className="filterCheckBox"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="womenCheckBox">Women</label>
        </li>
      </ul>
    </div>
  );
};

export default GenderFilter;
