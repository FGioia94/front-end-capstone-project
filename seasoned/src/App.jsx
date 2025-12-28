import GameField from "./components/GameField/GameField";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar/CustomNavbar";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import ProductDetail from "./components/ProductDetail";
import SearchResult from "./components/SearchResult";
import Register from "./components/Register";
import Contacts from "./components/Contacts";
import Login from "./components/Login";
import Checkout from "./components/Checkout";
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from './store';
import { fetchProducts } from './store/slices/productsSlice';
import { selectIsAdmin } from './store/slices/userSlice';

function Home() {
  return (
    <>
      <CustomNavbar />
      <GameField />
    </>
  );
}

function ContactsPage() {
  return (
    <>
      <CustomNavbar />
      <Contacts />
    </>
  );
}

function LoginPage() {
  return (
    <>
      <CustomNavbar />
      <Login />
    </>
  );
}

function RegisterPage() {
  return (
    <>
      <CustomNavbar />
      <Register />
    </>
  );
}

function SearchResultPage() {
  return (
    <>
      <CustomNavbar />
      <SearchResult />
    </>
  );
}

function AppContent() {
  const dispatch = useDispatch();
  const isAdmin = useSelector(selectIsAdmin);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
  
  return (
    <div className={isAdmin ? "admin-dark-mode" : ""}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<ContactsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
