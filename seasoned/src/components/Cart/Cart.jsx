import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router";
import "./Cart.css";

const Cart = ({ cart, setCart, compact = false }) => {
  const [visible, setVisible] = useState(false);

  const totalQuantity = (cart || []).reduce((s, it) => s + (it.quantity || 1), 0);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem("cart");
    if (storedProducts) {
      setCart(JSON.parse(storedProducts));
    }
  }, []);


  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...cart, { ...product, quantity: 1 }];
    }
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      {compact ? (
        <Button
          variant="link"
          className="cart-toggle"
          onClick={() => setVisible(!visible)}
        >
          <span className="cart-icon">🛒</span>
          {totalQuantity > 0 && <span className="cart-badge">{totalQuantity}</span>}
        </Button>
      ) : (
        <Button onClick={() => setVisible(!visible)}>Cart</Button>
      )}

      {visible &&
        createPortal(
          <div className="cart-popup">
            <div className="cart-header">
              <h4>Your Cart</h4>
              <Button variant="light" size="sm" onClick={() => setVisible(false)}>
                ✕
              </Button>
            </div>

            {cart.length === 0 && <p className="empty">Your cart is empty</p>}

            <div className="cart-items">
              {cart.map((prod) => (
                <Card key={prod.id} className="cart-item">
                  <div className="cart-main">
                    <Link to={`/product/${prod.id}`} onClick={() => setVisible(false)}>
                      <img src={prod.image} alt={prod.title} />
                    </Link>
                    <div className="cart-info">
                        <Card.Text className="price">{prod.price}$</Card.Text>
                    </div>
                  </div>
                  <Card.Body>
                    <div className="quantity-controls">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(prod.id, (prod.quantity || 1) - 1)}
                      >
                        −
                      </Button>
                      <span className="quantity-display">×{prod.quantity || 1}</span>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => updateQuantity(prod.id, (prod.quantity || 1) + 1)}
                      >
                        +
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => removeFromCart(prod.id)}
                      >
                        Remove
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
            <div className="cart-footer">
              <div className="cart-total">Total: ${" "}{cart
                .reduce(
                  (sum, it) => sum + (Number(it.price) || 0) * (it.quantity || 1),
                  0
                )
                .toFixed(2)}</div>
              <div className="cart-actions">
                <Link to="/checkout" onClick={() => setVisible(false)}>
                  <Button variant="primary" size="sm">Checkout</Button>
                </Link>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

export default Cart;