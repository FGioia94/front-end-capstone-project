import ProductCard from "../ProductCard/ProductCard";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";

const GameField = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      console.log("Fetched data:", data);
      setProducts(data);
    };
    fetchProducts();
  }, []);

  console.log(products);
  return (
    <>
      {/*  */}
      {products.map((prod) => (
        <Card>
          <Card.Img variant="top" src={prod.image} />
          <Card.Body>
            <Card.Title>{prod.title}</Card.Title>
            <Card.Text>{prod.description}</Card.Text>
            <Card.Text>${prod.price} </Card.Text>
            <Button variant="primary">Add to Cart</Button>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};
export default GameField;
