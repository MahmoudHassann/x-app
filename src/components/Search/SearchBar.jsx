import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchQuery } from "../../redux/slices/search-slice";
import axios from "axios";

// const keywords = ["Nifous", "Nifous 22", "Carg", "Jean", "Mah"];
const keywords = [""];
const baseImageUrl = "https://mister-x-store.com/mister_x_site/public/imgs/";

const getProductsWithColors = (products) => {
  return products.flatMap((product) =>
    product.colors.map((colorOption) => ({
      id: product.product_id,
      name: product.product_name,
      category: product.category,
      image: colorOption.main_img,
      hoverImage: colorOption.hover_img,
      color: colorOption.color_name,
      price: colorOption.sizes[0]?.price || 0,
      priceAfterSale: colorOption.sizes[0]?.price_after_sale || 0,
      hasDiscount: colorOption.sizes[0]?.sale > 0,
      salePercentage: colorOption.sizes[0]?.sale || 0,
      variantId: `${product.product_id}-${colorOption.color_name}`,
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
        `https://mister-x-store.com/mister_x_site/public/api/products/desc/price/1/20`,
        {
          keyword: keyword,
        }
      );

      const productsWithColors = getProductsWithColors(
        response.data.data || []
      );
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
      product.color
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
              <div className="loader-container">
                <div className="spinner"></div>
                <p>loading ...</p>
              </div>
            </li>
          )}
          {!loading && combinedResults.length > 0 && (
            <>
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
                    <div className="keyword-item">
                      <p className="keyword">{item.value}</p>
                    </div>
                  ) : (
                    <div className="search_product">
                      <div className="image">
                        <img
                          src={`${baseImageUrl}${item.value.image}`}
                          alt={item.value.name}
                        />
                      </div>
                      <div className="details">
                        <div className="left">
                          <p className="name">{item.value.name}</p>
                          <div className="meta">
                            <span className="color">{item.value.color}</span>
                            {item.value.category && (
                              <>
                                <span className="separator"> •• </span>
                                <span className="category">
                                  {item.value.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="price-section">
                          {item.value.hasDiscount ? (
                            <>
                              <p className="price">
                                {item.value.priceAfterSale} EGP
                              </p>
                            </>
                          ) : (
                            <p className="price">{item.value.price} EGP</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </>
          )}
          {!loading && combinedResults.length === 0 && (
            <li className="no-results">
              <div className="no-results-container">
                <p>No Results Found</p>
                <span>Try searching with different keywords</span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
