import "./CustomNavbar.css";

const CustomNavbar = () => {
  const handleSearch = (event) => {
    event.preventDefault();
    console.log("search");
  };

  const handleChange = (event) => {};
  return (
    <>
      <nav>
        <ul>
          <li>
            <a>Home</a>
          </li>
          <li>
            <a>About</a>
          </li>
          <li>
            <a>Get Started</a>
          </li>
          <li>
            <a>Contacts</a>
          </li>
          <li>
            <a>Admin Login</a>
          </li>

          <li>
            <form onSubmit={handleSearch}>
              <label for="searchbar"></label>
              <input type="text" name="searchbar" onChange={handleSearch} />
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
