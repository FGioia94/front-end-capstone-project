import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container, Card, Button } from "react-bootstrap";
import { Link } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart as removeFromCartAction, updateCartQuantity, addToCart as addToCartAction } from "../../store/slices/cartSlice";
import "./Cart.css";

const Cart = ({ compact = false }) => {
  const [visible, setVisible] = useState(false);
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const totalQuantity = (cart || []).reduce((s, it) => s + (it.quantity || 1), 0);


  const removeFromCart = (id) => {
    dispatch(removeFromCartAction(id));
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    dispatch(updateCartQuantity({ id, quantity: newQuantity }));
  };

  const addToCart = (product) => {
    dispatch(addToCartAction(product));
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