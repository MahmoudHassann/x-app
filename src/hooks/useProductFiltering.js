import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
export const useProductFiltering = (initialProducts) => {
  const [filteredProducts, setFilteredProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const filters = useSelector((state) => state.filters);

  useEffect(() => {
    const filterProducts = async () => {
      setLoading(true);
      try {
        let filtered = initialProducts;

        filtered = filtered.filter(
          (product) =>
            product.price >= filters.priceRange[0] &&
            product.price <= filters.priceRange[1]
        );

        for (let key of [
          "colors",
          "lengths",
          "sizes",
          "fit",
          "category",
          "gender",
        ]) {
          if (filters[key].length > 0) {
            if (key === "colors") {
              filtered = filtered.filter((product) =>
                filters[key].some((filterColor) =>
                  product.colors.some(
                    (productColor) =>
                      productColor.toLowerCase() === filterColor.toLowerCase()
                  )
                )
              );
            } else if (
              key === "sizes" ||
              key === "lengths" ||
              key === "category"
            ) {
              if (key === "sizes") {
                filtered = filtered.filter((product) => {
                  return product.colorPanel.some((colorVariant) => {
                    return filters.sizes.some((selectedSize) => {
                      const sizeKey = convertSizeFormat(selectedSize);

                      return (
                        Object.prototype.hasOwnProperty.call(
                          colorVariant.stockBySize,
                          sizeKey
                        ) && colorVariant.stockBySize[sizeKey] > 0
                      );
                    });
                  });
                });
              }
              if (key === "lengths") {
                filtered = filtered.filter((product) => {
                  return product.colorPanel.some((colorVariant) => {
                    const waist = colorVariant.stockBySize?.waist;
                    if (!waist) return false;
                    return Object.values(waist).some((waistSize) => {
                      const lengths = waistSize?.lengths;
                      if (!lengths) return false;
                      return filters.lengths.some((selectedLength) => {
                        return Object.prototype.hasOwnProperty.call(
                          lengths,
                          selectedLength
                        );
                      });
                    });
                  });
                });
              }
              if (key === "category") {
                filtered = filtered.filter((product) =>
                  filters[key].some((filterCategory) =>
                    product.category.some(
                      (productCategory) =>
                        productCategory.toLowerCase() ===
                        filterCategory.toLowerCase()
                    )
                  )
                );
              }
            } else {
              filtered = filtered.filter((product) =>
                filters[key].includes(product[key])
              );
            }
          }
        }

        if (filters.sortedBy) {
          switch (filters.sortedBy) {
            case "Low to High":
              filtered = filtered.sort((a, b) => a.price - b.price);
              break;
            case "High to Low":
              filtered = filtered.sort((a, b) => b.price - a.price);
              break;
            case "Bestsellers":
              filtered = filtered.sort((a, b) => b.sales - a.sales);
              break;
            case "New":
              filtered = filtered.sort(
                (a, b) => new Date(b.createdData) - new Date(a.createdData)
              );
              break;
            case "Sale":
              filtered = filtered
                .filter((product) => product.sale === true)
                .sort((a, b) => b.discount - a.discount);
              break;
            default:
              break;
          }
        }

        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error filtering products:", error);
      } finally {
        setLoading(false);
      }
    };

    filterProducts();
  }, [filters, initialProducts]);

  return { filteredProducts, loading };
};

function convertSizeFormat(size) {
  const sizeMap = {
    xxxSmallCheckBox: "XXXS",
    xxSmallCheckBox: "XXS",
    xSmallCheckBox: "XS",
    smallCheckBox: "S",
    mediumCheckBox: "M",
    largeCheckBox: "L",
    xLargeCheckBox: "XL",
    xxLargeCheckBox: "XXL",
    oneSizeCheckBox: "ONE_SIZE",
    29: "29",
    30: "30",
    31: "31",
    32: "32",
    33: "33",
    34: "34",
    36: "36",
  };

  return sizeMap[size] || size;
}
