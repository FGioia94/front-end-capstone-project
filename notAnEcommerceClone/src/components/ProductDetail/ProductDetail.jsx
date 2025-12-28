import { Container, Button, Row, Col } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import CustomNavbar from "../CustomNavbar/CustomNavbar";
import { useParams } from "react-router";
import "./ProductDetail.css";

const ProductDetail = () => {
  /*
   * This component displays detailed information about a specific product.
   * It retrieves the product ID from the URL parameters and fetches the corresponding product data from the Redux store.
   *
   * @returns {JSX.Element} The product detail component.
   */
  const { id } = useParams();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const dispatch = useDispatch();

  // Might change this to a spinner later
  if (loading || !products || products.length === 0) {
    return <p>Loading...</p>;
  }

  const productData = products[id - 1];

  const handleAdd = () => {
    dispatch(addToCart(productData));
  };

  return (
    <>
      <CustomNavbar />
      <Container className="product-detail-container">
        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="product-detail-card">
              <div className="product-image-wrapper">
                <img
                  className="product-image"
                  src={productData.image}
                  alt={productData.title}
                />
              </div>
              <div className="product-info">
                <h1 className="product-title">{productData.title}</h1>
                <p className="product-description">{productData.description}</p>
                <div className="product-footer">
                  <span className="product-price">${productData.price}</span>
                  <Button className="btn-add-to-cart" onClick={handleAdd}>
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetail;
