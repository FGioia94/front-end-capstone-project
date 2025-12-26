import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Container, Card, Button } from "react-bootstrap";

const Cart = ({ cart, setCart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem("cart");
    if (storedProducts) {
      setCart(JSON.parse(storedProducts));
    }
  }, []);

  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <>
      {/* TOGGLE BUTTON */}
      <Button onClick={() => setVisible(!visible)}>Cart</Button>

      {visible &&
        createPortal(
          <>
            <div className="cart-backdrop" onClick={() => setVisible(false)} />

            <div className="cart-popup">
              <h3>Your Cart</h3>

              {cart.length === 0 && <p>Your cart is empty</p>}

              {cart.map((prod) => (
                <Card key={prod.id} className="mb-3">
                  <Card.Img src={prod.image} />
                  <Card.Body>
                    <Card.Title>{prod.title}</Card.Title>
                    <Card.Text>{prod.price}$</Card.Text>
                    <Button variant="danger" onClick={() => removeFromCart(prod.id)}>
                      Remove
                    </Button>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>,
          document.body
        )}
    </>
  );
};

export default Cart;