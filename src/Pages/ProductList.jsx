import PropTypes from "prop-types";

const ProductList = ({ products }) => {
  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>Price: {product.price}</p>
          <p>Color: {product.color}</p>
          <p>Length: {product.length}</p>
          <p>Size: {product.size}</p>
          <p>Fit: {product.fit}</p>
          <p>Category: {product.category}</p>
          <p>Gender: {product.gender}</p>
        </div>
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      color: PropTypes.string.isRequired,
      length: PropTypes.string.isRequired,
      size: PropTypes.string.isRequired,
      fit: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      gender: PropTypes.string.isRequired,
    })
  ).isRequired,
};
export default ProductList;
