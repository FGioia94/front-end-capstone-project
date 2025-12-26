import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

const ProductCard = ({ position, size, prod, gameMode, setCart }) => {
  const pos = position || { x: 0, y: 0 };

  if (!size) {
    size = { height: 80, width: 100 };
  }

  const addToCart = () => {
    let cart = [];
    const storedProducts = sessionStorage.getItem("cart");
    if (storedProducts) {
      cart = JSON.parse(storedProducts);
    }
    cart.push(prod);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
  };

  return (
    <Card
      className={
        gameMode ? "card product-card" : "card product-card game-display"
      }
      style={{
        "--card-height": `${size.height}px`,
        "--card-width": `${size.width}px`,
        "--card-x": `${pos.x}px`,
        "--card-y": `${pos.y}px`,
      }}
    >
      <Link to={`/product/${prod.id}`}>
        <Card.Img src={prod.image} />
      </Link>

      {!gameMode && (
        <Card.Body>
          <Link to={`/product/${prod.id}`} className="card-title-link">
            <Card.Title className="card-title">{prod.title}</Card.Title>
          </Link>

          <Card.Text>${prod.price}</Card.Text>
          <Button variant="primary" onClick={addToCart}>
            Add to Cart
          </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default ProductCard;
