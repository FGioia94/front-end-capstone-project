import GameField from "./components/GameField/GameField";
import "normalize.css";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar/CustomNavbar";
import { BrowserRouter, Routes, Route, data } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ProductDetail from "./components/ProductDetail";
import SearchResult from "./components/SearchResult";
import Register from "./components/Register";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import PriceFilter from "./components/PriceFilter";

function Home({ products, setProducts, cart, setCart }) {
  const [filterPrice, setFilterPrice] = useState([795, 99900]);
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
      ></CustomNavbar>
      <PriceFilter
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
      ></PriceFilter>
      <GameField
        products={products}
        setProducts={setProducts}
        setCart={setCart}
        filterPrice={filterPrice}
        setFilterPrice={setFilterPrice}
      ></GameField>
    </>
  );
}

function ContactsPage({ products, setProducts, cart, setCart }) {
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
      ></CustomNavbar>
      <Contacts></Contacts>
    </>
  );
}

function LoginPage({ products, setProducts, cart, setCart }) {
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
      ></CustomNavbar>
      <Login></Login>
    </>
  );
}

function RegisterPage({ products, setProducts, cart, setCart }) {
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
      ></CustomNavbar>
      <Register></Register>
    </>
  );
}

function SearchResultPage({ products, setProducts, cart, setCart }) {
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
      ></CustomNavbar>
      <SearchResult
        key={products.length}
        products={products}
        cart={cart}
        setCart={setCart}
      ></SearchResult>
    </>
  );
}
function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Home
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/contacts"
          element={<ContactsPage setProducts={setProducts} cart={cart} />}
        />
        <Route
          path="/login"
          element={<LoginPage setProducts={setProducts} cart={cart} />}
        />
        <Route
          path="/register"
          element={<RegisterPage setProducts={setProducts} cart={cart} />}
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              products={products}
              setProducts={setProducts}
              cart={cart}
            />
          }
        />{" "}
        <Route
          path="/search"
          element={
            <SearchResultPage
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
