import "./CustomNavbar.css";
import { Link, useNavigate } from "react-router";
import Cart from "../Cart/Cart";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { logout as logoutAction } from "../../store/slices/userSlice";
import { selectUser, selectIsLoggedIn } from "../../store/slices/userSlice";

const CustomNavbar = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate("/");
  };

  const handleHomeClick = () => {
    // Navigation handled by router
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
            <Cart compact={true} />
          </li>
        </ul>
      </nav>
    </>
  );
};

export default CustomNavbar;
