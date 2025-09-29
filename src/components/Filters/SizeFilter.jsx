import { useDispatch, useSelector } from "react-redux";
 import { useEffect, useState } from "react";
import axios from "axios";
import { setSizes } from "../../redux/slices/filter-slice";

const SizeFilter = () => {
  const dispatch = useDispatch();
  const selectedSizes = useSelector((state) => state.filters.sizes);
    const [sizesData, setSizesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  const getSizes = async () => {
    try {
      const response = await axios.get(
        "https://mister-x-store.com/mister_x_site/public/api/all/sizes"
      );

      console.log(response, "responseresponseresponseresponse");
      setSizesData(response.data?.data ?? []);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSizes();
  }, []);
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
        {sizesData.map(({ size_name, size_type, size_id }) => (
          <li key={size_id}>
            <input
              type="checkbox"
              value={size_id}
              name={size_type}
              id={`size${size_type}CheckBox`}
              className="filterCheckBox"
              onChange={handleCheckBoxChange}
            />
            <label htmlFor={`size${size_type}CheckBox`}>{size_name}</label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SizeFilter;
