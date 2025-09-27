import PropTypes from "prop-types";
export const FitFilter = ({ setFilters }) => {
  const handleCheckBoxChange = (event) => {
    const { name, checked } = event.target;

    setFilters((prevFilters) => {
      let updatedSizeFilters;

      if (checked) {
        updatedSizeFilters = prevFilters.lengths.includes(name)
          ? prevFilters.lengths
          : [...prevFilters.lengths, name];
      } else {
        updatedSizeFilters = prevFilters.lengths.filter(
          (length) => length !== name
        );
      }

      return {
        ...prevFilters,
        lengths: updatedSizeFilters,
      };
    });
  };
  return (
    <div className="by-fit">
      <button
        className="btn btn-secondary dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Fit
      </button>
      <ul className="dropdown-menu parentFilterPanel">
        <li>
          <input
            type="checkbox"
            name="super_Skinny"
            id="superSkinnyCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="superSkinnyCheckBox">Super Skinny</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="aLine"
            id="aLineCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="aLineCheckBox">A-line</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="bootcut"
            id="bootcutCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="bootcutCheckBox">Bootcut</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="skinny"
            id="skinnyCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="skinnyCheckBox">Skinny</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="trucker"
            id="truckerCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="truckerCheckBox">Trucker</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="slim"
            id="slimCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="slimCheckBox">Slim</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="tapered"
            id="taperedCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="taperedCheckBox">Tapered</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="loose"
            id="looseCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="looseCheckBox">Loose</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="straight"
            id="straightCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="straightCheckBox">Straight</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="bootcutFlare"
            id="bootcutFlareCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="bootcutFlareCheckBox">Bootcut & Flare</label>
        </li>
        <li>
          <input
            type="checkbox"
            name="boyfriend"
            id="boyfriendCheckBox"
            className="filterCheckBox"
          />
          <label htmlFor="boyfriendCheckBox">Boyfriend</label>
        </li>
      </ul>
    </div>
  );
};

FitFilter.propTypes = {
  setFilters: PropTypes.func.isRequired,
};

export default FitFilter;
