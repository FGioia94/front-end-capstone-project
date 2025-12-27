import { Container, Button, Row, Col } from "react-bootstrap";
import CustomNavbar from "./CustomNavbar/CustomNavbar";
import { useParams } from "react-router";
import "./ProductDetail.css";
const ProductDetail = ({ products, cart, setCart, addToCart }) => {
  // Why fetching here again?
  // Even though it might be better performance-wise to just lift the state up
  // passing an object with all the data, this would fail if the user tries to reach
  // for the page by typing the specific URL, without reaching the home page first
  const { id } = useParams();
  // const [productData, setProductData] = useState();

  if (!products || products.length === 0) {
    return <p>Loading...</p>;
  }

  const productData = products[id-1];
  const handleAdd = () => {
    if (addToCart) addToCart(productData);
  };

  return (
    <>
      <CustomNavbar products={products} cart={cart} setCart={setCart} />
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
                  <Button 
                    className="btn-add-to-cart"
                    onClick={handleAdd}
                  >
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
