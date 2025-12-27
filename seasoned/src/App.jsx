import GameField from "./components/GameField/GameField";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar/CustomNavbar";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ProductDetail from "./components/ProductDetail";
import SearchResult from "./components/SearchResult";
import Register from "./components/Register";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import PriceFilter from "./components/PriceFilter";
import { UserProvider, useUser } from "./context/UserContext";

function Home({ products, setProducts, cart, setCart, addToCart }) {
  const [filterPrice, setFilterPrice] = useState([795, 100000]);
  const [gameMode, setGameMode] = useState(false);
  
  return (
    <>
      <CustomNavbar
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
        setGameMode={setGameMode}
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
        addToCart={addToCart}
        gameMode={gameMode}
        setGameMode={setGameMode}
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

  const addToCart = (product) => {
    const stored = sessionStorage.getItem("cart") || "[]";
    const currentCart = JSON.parse(stored);
    const existingItem = currentCart.find((item) => item.id === product.id);

    let updatedCart;
    if (existingItem) {
      updatedCart = currentCart.map((item) =>
        item.id === product.id
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, quantity: 1 }];
    }

    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <UserProvider>
      <AppContent 
        products={products}
        setProducts={setProducts}
        cart={cart}
        setCart={setCart}
        addToCart={addToCart}
      />
    </UserProvider>
  );
}

function AppContent({ products, setProducts, cart, setCart, addToCart }) {
  const { isAdmin } = useUser();
  return (
    <div className={isAdmin ? "admin-dark-mode" : ""}>
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
                addToCart={addToCart}
              />
            }
          />
        <Route
          path="/contacts"
          element={
            <ContactsPage
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/register"
          element={
            <RegisterPage
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProductDetail
              products={products}
              setProducts={setProducts}
              cart={cart}
              setCart={setCart}
              addToCart={addToCart}
            />
          }
        />
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
        <Route
          path="/checkout"
          element={<Checkout products={products} cart={cart} setCart={setCart} />}
        />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
