import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

const ProductCard = ({ position, size, prod, gameMode, setCart, addToCart, setIsPaused, manualPauseRef, cardStyle }) => {
  const pos = position || { x: 0, y: 0 };
  const finalSize = size || { width: 100, height: 80 };

  const handleAddToCart = () => {
    if (addToCart) {
      addToCart(prod);
    }
  };

  const handleMouseEnter = () => {
    if (gameMode && setIsPaused) {
      setIsPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (gameMode && setIsPaused && manualPauseRef && !manualPauseRef.current) {
      setIsPaused(false);
    }
  };

  if (gameMode) {
    return (
      <div
        className="product-card game-mode-card"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          "--card-x": `${pos.x}px`,
          "--card-y": `${pos.y}px`,
          "--card-width": `${finalSize.width}px`,
          "--card-height": `${finalSize.height}px`,
          ...cardStyle,
        }}
      >
        <Link to={`/product/${prod.id}`} className="game-card-image-link">
          <img src={prod.image} alt={prod.title} />
        </Link>
        <Button 
          variant="primary" 
          size="sm" 
          onClick={(e) => {
            e.preventDefault();
            handleAddToCart();
          }}
          className="game-card-btn"
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <Card className="product-card" style={cardStyle}>
      <Link to={`/product/${prod.id}`} className="card-link">
        <Card.Img src={prod.image} />
      </Link>

      <Card.Body>
        <Link to={`/product/${prod.id}`} className="card-link">
          <Card.Title>{prod.title}</Card.Title>
        </Link>

        <Card.Text>${prod.price}</Card.Text>
        <Button variant="primary" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;