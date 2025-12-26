import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import CustomNavbar from "./CustomNavbar/CustomNavbar";
import { useParams } from "react-router";
const ProductDetail = ({ products }) => {
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
  return (
    <>
      <CustomNavbar></CustomNavbar>
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Img
                variant="top"
                src={productData.image}
                alt={productData.title}
              />
              <Card.Body>
                <Card.Title>
                  <h2>{productData.title}</h2>
                </Card.Title>
                <Card.Text>{productData.description}</Card.Text>
                <Card.Text>{productData.price}</Card.Text>
                <Button variant="primary">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProductDetail;
