import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
const Cart = ({ cart, setCart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const storedProducts = sessionStorage.getItem("cart");
    if (storedProducts) {
      setCart(JSON.parse(storedProducts));
      console.log(JSON.parse(storedProducts));
    }
  }, []);

  const removeFromCart = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <>
      <Button
        onClick={() => {
          setVisible(!visible);
        }}
      >
        Cart
      </Button>
      {visible && (
        <Container id="cart-container">
          <p>{JSON.stringify(cart)}</p>
          {cart.map((prod) => {
            <Card key={prod.id}>
              <Card.Img src={prod.Img}></Card.Img>
              <Card.Body>
                <Card.Title>{prod.Title}</Card.Title>
                <Card.Text>{prod.price}$</Card.Text>
                <Card.Button
                  variant="primary"
                  onClick={() => {
                    removeFromCart(prod.id);
                    console.log(sessionStorage);
                  }}
                ></Card.Button>
              </Card.Body>
            </Card>;
          })}
        </Container>
      )}
    </>
  );
};

export default Cart;
