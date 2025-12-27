import "./CustomNavbar.css";
import { Link, useNavigate } from "react-router";
import Cart from "../Cart/Cart";
import SearchBar from "./SearchBar";
import { useUser } from "../../context/UserContext";

const CustomNavbar = ({ products, cart, setCart, setGameMode }) => {
  const { isLoggedIn, user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleHomeClick = () => {
    if (setGameMode) {
      setGameMode(false);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to={"/"} onClick={handleHomeClick}>Home</Link>
          </li>
          <li>
            <Link to={"/contacts"}>Contacts</Link>
          </li>

          <li className="nav-search">
            <SearchBar products={products} />
          </li>

          <li className="nav-right">
            {isLoggedIn ? (
              <>
                <span className="nav-username">{user?.username}</span>
                <span style={{ margin: "0 0.5rem" }}>|</span>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to={"/login"}>Login</Link>
                <span style={{ margin: "0 0.5rem" }}>|</span>
                Not a user yet? <Link to={"/register"}>Sign In</Link>
              </>
            )}
            <Cart cart={cart} setCart={setCart} compact={true} />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default CustomNavbar;
