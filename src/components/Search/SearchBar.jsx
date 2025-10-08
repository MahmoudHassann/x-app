import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "../../redux/slices/search-slice";
import axios from "axios";

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
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const debounceTimer = useRef(null);


  const fetchProducts = async (keyword) => {
    if (!keyword.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `https://mister-x-store.com/mister_x_site/public/api/products/1/20`,
        { 
          keyword: keyword 
        }
      );

      
      const productsWithColors = getProductsWithColors(response.data.data || []);
      setSearchResults(productsWithColors);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (inputValue) {
      debounceTimer.current = setTimeout(() => {
        fetchProducts(inputValue);
      }, 500);
    } else {
      setSearchResults([]);
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [inputValue]);

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
      
      {inputValue && showResult && (
        <ul className="search-results">
          {loading && (
            <li className="loading">
              <p>جاري البحث...</p>
            </li>
          )}
          {!loading && combinedResults.length > 0 && (
            combinedResults.map((item) => (
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
            ))
          )}
          {!loading && combinedResults.length === 0 && (
            <li className="no-results">
              <p>No Result Found</p>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}