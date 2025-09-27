import { useDispatch, useSelector } from "react-redux";
import { setSizes } from "../../redux/slices/filter-slice";

const SizeFilter = () => {
  const dispatch = useDispatch();
  const selectedSizes = useSelector((state) => state.filters.sizes);

  const handleCheckBoxChange = (event) => {
    const { name, checked } = event.target;
    let updatedSizes;

    if (checked) {
      updatedSizes = [...selectedSizes, name];
    } else {
      updatedSizes = selectedSizes.filter((size) => size !== name);
    }

    dispatch(setSizes(updatedSizes));
  };

  const sizes = [
    { name: "XXS", label: "XXS" },
    { name: "XS", label: "XS" },
    { name: "S", label: "S" },
    { name: "M", label: "M" },
    { name: "L", label: "L" },
    { name: "XL", label: "XL" },
    { name: "XXL", label: "XXL" },
    { name: "29", label: "29" },
    { name: "30", label: "30" },
    { name: "31", label: "31" },
    { name: "32", label: "32" },
    { name: "33", label: "33" },
    { name: "34", label: "34" },
    { name: "36", label: "36" },
  ];

  return (
    <div className="by-size">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Size
      </button>
      <ul className="dropdown-menu parentFilterPanel">
        {sizes.map(({ name, label }) => (
          <li key={name}>
            <input
              type="checkbox"
              name={name}
              id={`size${name}CheckBox`}
              className="filterCheckBox"
              onChange={handleCheckBoxChange}
              checked={selectedSizes.includes(name)}
            />
            <label htmlFor={`size${name}CheckBox`}>{label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SizeFilter;
