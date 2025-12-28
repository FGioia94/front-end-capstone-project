import { Link } from "react-router";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";
import CustomNavbar from "./CustomNavbar/CustomNavbar";
import "./Checkout.css";

const Checkout = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  
  const total = cart.reduce(
    (sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1),
    0
  );

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(id);
      return;
    }
    dispatch(updateCartQuantity({ id, quantity: newQty }));
  };

  const handleRemoveFromCart = (id) => {
    dispatch(removeFromCart(id));
  };

  const handlePay = () => {
    alert(
      "Sorry, this is just an university project so these products don't really exist, but thanks for trying - Francesco"
    );
  };

  return (
    <>
      <CustomNavbar />
      <Container className="checkout-wrap mt-4">
        <h2 className="mb-3">Checkout</h2>
        <Row>
          <Col md={8}>
            {cart.length === 0 && <p>Your cart is empty.</p>}
            {cart.map((item) => (
              <Card key={item.id} className="checkout-item mb-2">
                <Card.Body className="d-flex align-items-center">
                  <Link to={`/product/${item.id}`} className="checkout-link">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="checkout-thumb"
                    />
                  </Link>
                  <div className="flex-grow-1 ms-3">
                    <Link to={`/product/${item.id}`} className="checkout-link title">
                      {item.title}
                    </Link>
                    <div className="muted">Price: ${Number(item.price).toFixed(2)}</div>
                    <div className="quantity-row">
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, (item.quantity || 1) - 1)}>
                        −
                      </Button>
                      <span className="mx-2">{item.quantity || 1}</span>
                      <Button size="sm" variant="outline-secondary" onClick={() => updateQuantity(item.id, (item.quantity || 1) + 1)}>
                        +
                      </Button>
                      <Button size="sm" variant="danger" className="ms-3" onClick={() => handleRemoveFromCart(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            ))}
          </Col>
          <Col md={4}>
            <Card className="summary-card">
              <Card.Body>
                <h4>Summary</h4>
                <div className="total-amount">${total.toFixed(2)}</div>
                <div className="mt-3 d-grid">
                  <Button variant="success" onClick={handlePay}>
                    Pay Now
                  </Button>
                </div>
                <div className="mt-2">
                  <Link to="/">Continue shopping</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Checkout;
