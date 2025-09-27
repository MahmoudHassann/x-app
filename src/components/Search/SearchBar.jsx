import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "../../redux/slices/search-slice";
const keywords = ["Nifous", "Nifous 22", "Carg", "Jean", "Mah"];
const getProductsWithColors = (products) => {
  return products.flatMap((product) =>
    product.colorPanel.map((panel) => ({
      ...product,
      mainImage: {
        color: panel.color,
        image: panel.colorImage,
      },
      variantId: `${product.id}-${panel.color}`,
    }))
  );
};
export default function SearchBar() {
  const [showResult, setShowResult] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const filteredProducts = useSelector(
    (state) => state.search.searchProducts || []
  );
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    if (inputValue) {
      const productsWithColors = getProductsWithColors(filteredProducts);

      const results = productsWithColors.filter((product) =>
        product.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [inputValue, filteredProducts]);
  const handleFocus = () => {
    if (inputValue) {
      setShowResult(true);
    }
  };

  const handleBlur = () => {
    setShowResult(false);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    dispatch(setSearchQuery(e.target.value));
    setShowResult(e.target.value.length > 0);
  };

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      dispatch(setSearchQuery(inputValue));
      navigate(`/search`);
      inputRef.current.blur();
    }
  };
  const handleResultClick = (product) => {
    const productUrl = `/product/${product.id}?color=${encodeURIComponent(
      product.mainImage.color
    )}`;

    navigate(`/shop${productUrl}`);

    inputRef.current.blur();
    setShowResult(false);
  };
  const handleKeywordClick = (keyword) => {
    setInputValue(keyword);
    dispatch(setSearchQuery(keyword));
    navigate(`/search`);
    inputRef.current.blur();
    setShowResult(false);
  };

  const combinedResults = [
    ...keywords
      .filter((keyword) =>
        keyword.toLowerCase().includes(inputValue.toLowerCase())
      )
      .map((keyword) => ({ isKeyword: true, value: keyword })),
    ...searchResults.map((product) => ({ isKeyword: false, value: product })),
  ];

  return (
    <div className="search">
      <label htmlFor="search">
        <i className="fa-solid fa-magnifying-glass"></i>
      </label>
      <input
        id="search"
        type="text"
        placeholder="search"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoComplete="off"
        className="search_input"
        ref={inputRef}
      />
      
      {inputValue && combinedResults.length > 0 && showResult && (
        <ul className="search-results">
          {combinedResults.map((item) => (
            <li
              key={item.isKeyword ? item.value : item.value.variantId}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                item.isKeyword
                  ? handleKeywordClick(item.value)
                  : handleResultClick(item.value)
              }
            >
              {item.isKeyword ? (
                <p className="keyword">{item.value}</p>
              ) : (
                <div className="search_product">
                  <div className="image">
                    <img src={item.value.mainImage.image} alt="" />
                  </div>
                  <div className="details">
                    <div className="left">
                      <p className="name">{item.value.name}</p>
                      <p className="color">{item.value.mainImage.color}</p>
                    </div>
                    <p className="price">E{item.value.price}</p>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
