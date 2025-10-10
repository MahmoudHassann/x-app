import { useSelector, useDispatch } from "react-redux";
import FilterPanel from "../components/FilterPanel/FilterPanel";
import Product from "../components/Shop/Product";
import TopBar from "../components/TopBar";
import { useEffect, useState, useMemo } from "react";
 
import { useLocation } from "react-router-dom";
import { resetFilters, setCategory } from "../redux/slices/filter-slice";
import Api from "../dependencies/instanceAxios";

export default function Shop() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.layout.navOpen);
  const filters = useSelector((state) => state.filters);
  const [products, setProducts] = useState([]);
  const [pageSize, setPageSize] = useState(12);
  const [pageNumber, setPageNumber] = useState(1);
  const [sortDirection, setSortDirection] = useState("desc");
  const [sortKey, setSortKey] = useState("");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const catId = queryParams.get("cat");
  const catIdStr = catId ? String(catId) : null;

  useEffect(() => {
    if (!catIdStr) return;
    const current = (filters.category || []).map(String);
    if (!current.includes(catIdStr)) {
      dispatch(setCategory([...current, catIdStr]));
    }
  }, [catIdStr]);

  const mergedFilters = useMemo(() => {
    const f = { ...filters };
    const current = (f.category || []).map(String);
    if (catIdStr && !current.includes(catIdStr)) {
      f.category = [...current, catIdStr];
    } else {
      f.category = current;
    }
    return f;
  }, [filters, catIdStr]);

  useEffect(() => {
    return () => {
      dispatch(resetFilters());
    };
  }, []);

  const getProducts = async (filtersArg) => {
    let { sortedBy, ...cleanFilters } = filtersArg || {};
    let sortDir = sortDirection;

    switch (sortedBy) {
      case "Low to High":
        sortedBy = "price";
        sortDir = "asc";
        break;
      case "High to Low":
        sortedBy = "price";
        sortDir = "desc";
        break;
      default:
        sortedBy = sortedBy || "";
        sortDir = "desc";
        break;
    }

    setSortDirection(sortDir);

    if (cleanFilters?.category && Array.isArray(cleanFilters.category)) {
      cleanFilters.category = cleanFilters.category.map(String);
    }

    const response = await Api.post(
      `products/${sortDir}/${sortedBy}/${pageNumber}/${pageSize}`,
      {
        data: { filters: cleanFilters },
      }
    );
 

    setProducts(response.data.data || []);
  };

  useEffect(() => {
    getProducts(mergedFilters);
  }, [mergedFilters, pageNumber, pageSize]);

  useEffect(() => {
    return () => {
      resetFilters();
    };
  }, []);

  return (
    <main className="shop-all">
      <div className={`custom-container ${isOpen ? "nav-open" : ""}`}>
        <TopBar />
        <header>
          <picture className="top-banner-image">
            <source
              media="(min-width: 1024px)"
              srcSet="/pages/shop/Banner_Desktop.jpeg"
            />
            <source
              media="(min-width: 768px)"
              srcSet="/pages/shop/Banner_Tablet.jpeg"
            />
            <source
              media="(min-width: 0px)"
              srcSet="/pages/shop/Banner_Mobile.jpeg"
            />
            <img decoding="async" alt="stay tuned htmlFor upcoming deals" />
          </picture>
          <div className="banner-content">
            <h1>stay tuned for upcomming Deals</h1>
            <div>
              Our men sale may have ended, but you can still explore <br />
              our&nbsp;
              <u>
                <b>men collection</b>
              </u>
              . Subscribe to our newsletter to stay <br /> up to date with the
              latest news and offers.
            </div>
          </div>
        </header>

        <section className="products_wrapper">
          <FilterPanel filters={mergedFilters} />
          <div className="products">
            <div className="container-fluid">
              <div className="row">
                {products.map((product, index) => (
                  <Product key={index} product={product} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
