import { useDispatch, useSelector } from "react-redux";
import { setSizes } from "../../redux/slices/filter-slice";

const SizeFilter = () => {
  const dispatch = useDispatch();
  const selectedSizes = useSelector((state) => state.filters.sizes);

  const handleCheckBoxChange = (event) => {
    const { value, checked } = event.target;
    let updatedSizes;

    if (checked) {
      updatedSizes = [...selectedSizes, value];
    } else {
      updatedSizes = selectedSizes.filter((size) => size !== value);
    }

    dispatch(setSizes(updatedSizes));
  };

  const sizes = [
    { name: "XXS", label: "XXS" ,id:1},
    { name: "XS", label: "XS",id:2 },
    
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
        {sizes.map(({ name, label,id }) => (
          <li key={name}>
            <input
              type="checkbox"
               value={id}
              name={name}
              id={`size${name}CheckBox`}
              className="filterCheckBox"
              onChange={handleCheckBoxChange}
              
            />
            <label htmlFor={`size${name}CheckBox`}>{label}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SizeFilter;
