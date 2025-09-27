import { useDispatch, useSelector } from "react-redux";
import { setLengths } from "../../redux/slices/filter-slice";

const LengthFilter = () => {
  const dispatch = useDispatch();
  const selectedLengths = useSelector((state) => state.filters.lengths);

  const handleCheckBoxChange = (event) => {
    const { name, checked } = event.target;

    let updatedLengths;
    if (checked) {
      updatedLengths = selectedLengths.includes(name)
        ? selectedLengths
        : [...selectedLengths, name];
    } else {
      updatedLengths = selectedLengths.filter((length) => length !== name);
    }
    dispatch(setLengths(updatedLengths));
  };
  const lengthOptions = [26, 28, 30, 32, 34, 36, 38];

  return (
    <div className="by-length">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Length
      </button>
      <ul className="dropdown-menu parentFilterPanel ">
        {lengthOptions.map((length) => (
          <li key={length}>
            <input
              type="checkbox"
              name={length.toString()}
              id={`length${length}CheckBox`}
              className="filterCheckBox"
              onChange={handleCheckBoxChange}
              checked={selectedLengths.includes(length.toString())}
            />
            <label htmlFor={`length${length}CheckBox`}>{length}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LengthFilter;
