import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

const ProductCard = ({ position, size, prod, gameMode }) => {
  const pos = position || { x: 0, y: 0 };

  if (!size) {
    size = { height: 80, width: 100 };
  }

  const cardContent = (
    <Card
      className={gameMode ? "card product-card" : "card product-card game-display"}
      style={{
        "--card-height": `${size.height}px`,
        "--card-width": `${size.width}px`,
        "--card-x": `${pos.x}px`,
        "--card-y": `${pos.y}px`,
      }}
    >
      <Card.Img src={prod.image} />
      {!gameMode && (
        <Card.Body>
          <Card.Title className="card-title">{prod.title}</Card.Title>
          <Card.Text>${prod.price}</Card.Text>
          <Button variant="primary">Add to Cart</Button>
        </Card.Body>
      )}
    </Card>
  );

  return gameMode ? cardContent : <Link to={`/product/${prod.id}`}>{cardContent}</Link>;
};

export default ProductCard;