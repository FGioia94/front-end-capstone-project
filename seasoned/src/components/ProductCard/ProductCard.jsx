import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

const ProductCard = ({ position, size, prod, gameMode, setCart }) => {
  const pos = position || { x: 0, y: 0 };
  const finalSize = size || { width: 100, height: 80 };

  const addToCart = () => {
    let cart = [];
    const stored = sessionStorage.getItem("cart");
    if (stored) cart = JSON.parse(stored);
    cart.push(prod);
    sessionStorage.setItem("cart", JSON.stringify(cart));
    setCart(cart);
  };

  if (gameMode) {
    return (
      <div
        className="product-card"
        style={{
          "--card-x": `${pos.x}px`,
          "--card-y": `${pos.y}px`,
          "--card-width": `${finalSize.width}px`,
          "--card-height": `${finalSize.height}px`,
        }}
      >
        <img src={prod.image} alt={prod.title} />
      </div>
    );
  }

  return (
    <Card className="product-card">
      <Link to={`/product/${prod.id}`} className="card-link">
        <Card.Img src={prod.image} />
      </Link>

      <Card.Body>
        <Link to={`/product/${prod.id}`} className="card-link">
          <Card.Title>{prod.title}</Card.Title>
        </Link>

        <Card.Text>${prod.price}</Card.Text>
        <Button variant="primary" onClick={addToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;