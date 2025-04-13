
const ProductDescription = ({ product }) => {
  return (
    <div className="prose max-w-none">
      <p className="mb-4">
        {product.description}
      </p>
      <p className="mb-4">
        Experience the peak of performance with the {product.name}, designed for those who demand nothing but the best. 
        This product combines cutting-edge technology with elegant design to deliver an unparalleled user experience.
      </p>
      <p>
        Whether you're a professional or enthusiast, the {product.name} will exceed your expectations in every way.
      </p>
    </div>
  );
};

export default ProductDescription;
