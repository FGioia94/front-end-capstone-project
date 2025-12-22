import GameField from "./components/GameField/GameField";
import "normalize.css";
import "./App.css";
import CustomNavbar from "./components/CustomNavbar/CustomNavbar";
import { BrowserRouter, Routes, Route, data } from "react-router";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import ProductDetail from "./components/ProductDetail";

function Home() {
  return (
    <>
      <CustomNavbar></CustomNavbar>
      <GameField></GameField>
    </>
  );
}

function About() {
  return (
    <>
      <CustomNavbar></CustomNavbar>
    </>
  );
}

function Contacts() {
  return (
    <>
      <CustomNavbar></CustomNavbar>
    </>
  );
}

function AdminLogin() {
  return (
    <>
      <CustomNavbar></CustomNavbar>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contacts" element={<Contacts />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/product/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
