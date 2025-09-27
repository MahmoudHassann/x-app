import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setColors } from "../../redux/slices/filter-slice";

const ColorFilter = () => {
  const dispatch = useDispatch();

  const [checkedColors, setCheckedColors] = useState({
    metalCheckBox: false,
    whiteCheckBox: false,
    beigeCheckBox: false,
    yellowCheckBox: false,
    orangeCheckBox: false,
    redCheckBox: false,
    pinkCheckBox: false,
    purpleCheckBox: false,
    lightBlueCheckBox: false,
    mediumBlueCheckBox: false,
    darkBlueCheckBox: false,
    greenCheckBox: false,
    brownCheckBox: false,
    greyCheckBox: false,
    blackCheckBox: false,
    otherCheckBox: false,
  });

  useEffect(() => {
    const activeColors = Object.keys(checkedColors)
      .filter((key) => checkedColors[key])
      .map((key) => key.replace("CheckBox", ""));

    dispatch(setColors(activeColors));
  }, [checkedColors, dispatch]);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;

    setCheckedColors((prevCheckedColors) => ({
      ...prevCheckedColors,
      [name]: checked,
    }));
  };
  const columnOneColors = [
    "metal",
    "white",
    "beige",
    "yellow",
    "orange",
    "red",
    "pink",
    "purple",
    "lightBlue",
  ];

  const columnTwoColors = [
    "mediumBlue",
    "darkBlue",
    "green",
    "brown",
    "grey",
    "black",
    "other",
  ];
  const ColorCheckbox = ({ color }) => (
    <li key={color}>
      <input
        type="checkbox"
        name={`${color}CheckBox`}
        id={`${color}CheckBox`}
        checked={checkedColors[`${color}CheckBox`]}
        onChange={handleCheckboxChange}
      />
      <label
        htmlFor={`${color}CheckBox`}
        style={{
          fontWeight: checkedColors[`${color}CheckBox`] ? "bold" : "normal",
        }}
      >
        {color.charAt(0).toUpperCase() +
          color
            .slice(1)
            .replace(/([A-Z])/g, " $1")
            .trim()}
      </label>
    </li>
  );
  return (
    <div className="by-color">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Color
      </button>
      <ul className="dropdown-menu">
        <div className="wrap">
          <div className="one-column">
            {columnOneColors.map((color) => (
              <ColorCheckbox key={color} color={color} />
            ))}
          </div>
          <div className="two-column">
            {columnTwoColors.map((color) => (
              <ColorCheckbox key={color} color={color} />
            ))}
          </div>
        </div>
      </ul>
    </div>
  );
};

export default ColorFilter;
