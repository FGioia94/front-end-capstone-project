import "./CustomNavbar.css";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Cart from "../Cart";
const CustomNavbar = ({ products, cart, setCart }) => {
  const [searchText, setSearchText] = useState("");
  const [warning, setWarning] = useState("");
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (searchText.trim() === "") {
  //     setWarning("Field cannot be empty!");
  //   } else {
  //     setWarning("");
  //   }
  // }, [searchText]);

  const checkText = () => {
    if (searchText.trim() === "") {
      setWarning("Field cannot be empty!");
      return false;
    } else {
      setWarning("");
      return true;
    }
  };

  const search = (event) => {
    event.preventDefault();
    if (checkText()) {
      navigate(`/search?q=${encodeURIComponent(searchText)}`, {
        state: {
          products: products,
        },
      });
    }
  };
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to={"/"}>Home</Link>
          </li>
          <li>
            <Link to={"/about"}>About</Link>
          </li>
          <li>
            <Link to={"/contacts"}>Contacts</Link>
          </li>
          <li>
            <Link to={"/login"}>Login</Link>
          </li>
          <li>
            Not a user yet? <Link to={"/register"}>Sign In</Link>
          </li>

          <li>
            <form onSubmit={search}>
              <input
                type="text"
                name="searchbar"
                onChange={(event) => {
                  setSearchText(event.target.value);
                }}
                onBlur={checkText}
                onFocus={() => {
                  setWarning("");
                }}
              />
              {warning && <p className="warning">{warning}</p>}
              <button type="submit" id="search-button">
                Search
              </button>
            </form>
          </li>
        </ul>
        <Cart cart={cart} setCart={setCart}></Cart>
      </nav>
    </>
  );
};

export default CustomNavbar;
