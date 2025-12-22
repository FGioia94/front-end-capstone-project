import "./CustomNavbar.css";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";

const CustomNavbar = ({ products }) => {
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
    } else {
      setWarning("");
    }
  };

  const search = (event) => {
    event.preventDefault();
    checkText();
    if (warning !== "") {
      return;
    } else {
      navigate(`/search?q=${encodeURIComponent(searchText)}`);
    }

    products.filter((prod) => {
      prod.title.toLowerCase().includes(searchText.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchText.toLowerCase());
    });
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
            <Link to={"/admin-login"}>Admin Login</Link>
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
                onFocus={() => {setWarning("")}}
              />
              {warning && <p className="warning">{warning}</p>}
              <button type="submit" id="search-button">
                Search
              </button>
            </form>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default CustomNavbar;
