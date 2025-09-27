import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TopBar from "../TopBar";
import FilterPanel from "../FilterPanel/FilterPanel";
import Product from "../Shop/Product";
import { useProductFiltering } from "../../hooks/useProductFiltering";
import { resetFilters } from "../../redux/slices/filter-slice";

export default function SearchPage() {
  const isOpen = useSelector((state) => state.layout.navOpen);
  const { searchQuery, searchProducts } = useSelector((state) => state.search);
  const { filteredProducts, loading } = useProductFiltering(searchProducts);
  const filters = useSelector((state) => state.filters);
  let dispatch = useDispatch();
  const getProductsWithColors = (finalProducts) => {
    return finalProducts.flatMap((product) =>
      product.colorPanel.map((panel) => ({
        ...product,
        mainImage: {
          color: panel.color,
          image: panel.colorImage,
        },
      }))
    );
  };
  const productsWithColors = filteredProducts
    ? getProductsWithColors(filteredProducts)
    : [];

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, []);

  return (
    <>
      <main className="search_page">
        <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
          <TopBar />
          <div className="result_search">
            <p>{`${productsWithColors.length} Result For ${searchQuery}`}</p>
          </div>

          <FilterPanel filters={filters} />

          <section className="products_wrapper">
            <div className="products">
              <div className="container-fluid">
                <div className="row">
                  {productsWithColors.map((product, index) => (
                    <Product key={index} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
