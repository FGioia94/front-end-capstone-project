import ProductCard from "../ProductCard/ProductCard";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import "./GameField.css";

const GameField = () => {
  const [products, setProducts] = useState([]);
  const [backgroundURL, setBackgroundURL] = useState("");
  const [gameMode, setGameMode] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      console.log("Fetched data:", data);
      setProducts(data);

      const priceList = data.map((prod) => prod.price);
      console.log(priceList);
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    if (gameMode) {
      setBackgroundURL("https://source.unsplash.com/random/1080x1920/?nature");
    } else {
      setBackgroundURL("");
    }
  }, [gameMode]);

  return (
    <>
      <div
        id="game-field"
        className={gameMode ? "game-display" : "product-display"}
        style={{ backgroundImage: `url(${backgroundURL})` }}
      >
        {/* {products.map((prod) => (
          <Card
            className="card product-card"
            style={{
              "--card-size": `${get_card_size(prod.price)}px`,
            }}
          >
            <Card.Img src={prod.image} />
            <Card.Body>
              <Card.Title>{prod.title}</Card.Title>
              <Card.Text>{gameMode ? prod.description : ""}</Card.Text>
              <Card.Text>${prod.price} </Card.Text>
              <Button variant="primary">Add to Cart</Button>
            </Card.Body>
          </Card>
        ))} */}
        <button onClick={() => setGameMode(!gameMode)}>
          {" "}
          {gameMode ? "Product Mode" : "Game Mode"}
        </button>
      </div>
    </>
  );
};

function get_card_size(price) {
  let size = 0;

  if (price < 50) {
    size = remap(price, 0.0, 50.0, 0.0, 50.0);
  } else if (price < 400) {
    size = remap(price, 0.0, 400.0, 0.0, 200.0);
  } else {
    size = 80.0;
  }

  return size;
}

function remap(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export default GameField;
