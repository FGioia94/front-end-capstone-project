import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router";

const ProductCard = ({
  position,
  size,
  prod,
  gameMode,
  setCart,
  addToCart,
  setIsPaused,
  manualPauseRef,
  cardStyle,
}) => {
  /*
   * ProductCard component displays a product in either standard or game mode.
   *
   * @param {object} position - The position of the card in game mode {x, y}.
   * @param {object} size - The size of the card in game mode {width, height}.
   * @param {object} prod - The product data to display.
   * @param {boolean} gameMode - Whether to render in game mode or standard mode.
   * @param {function} setCart - Function to update the cart (not used here).
   * @param {function} addToCart - Function to add the product to the cart.
   * @param {function} setIsPaused - Function to pause/resume the game.
   * @param {object} manualPauseRef - Ref to track if the game is manually paused.
   * @param {object} cardStyle - Additional styles to apply to the card.
   * @returns {JSX.Element} The rendered ProductCard component.
   *
   * Note: In game mode, hovering over the card pauses the game.
   */
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
  
  // Resume game on mouse leave only if not manually paused
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
