import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import "./SearchBar.css";

const SearchBar = ({ products }) => {
  /*
   * This component provides a search bar with autocomplete suggestions.
   * 
   * @param {Array} products - List of products to search from.
   * @returns {JSX.Element} The search bar component.
   * */
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [warning, setWarning] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const searchBoxRef = useRef(null);

  // Generate autocomplete suggestions
  useEffect(() => {
    if (searchText.trim().length > 0) {
      const filtered = products
        .filter((prod) =>
          prod.title.toLowerCase().includes(searchText.toLowerCase())
        )
        .slice(0, 6);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchText, products]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const checkText = () => {
    if (searchText.trim() === "") {
      setWarning("Field cannot be empty!");
      return false;
    } else {
      setWarning("");
      return true;
    }
  };

  const search = (query) => {
    if (query.trim() === "") {
      setWarning("Field cannot be empty!");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(query)}`);
    setSearchText("");
    setSuggestions([]);
    setShowSuggestions(false);
    setWarning("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (checkText()) {
      search(searchText);
    }
  };

  const handleSuggestionClick = (prod) => {
    search(prod.title);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    // Handle keyboard navigation in suggestions
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className="search-bar-container" ref={searchBoxRef}>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => searchText.length > 0 && setShowSuggestions(true)}
          onBlur={() => !showSuggestions && checkText()}
        />
        <button type="submit" className="search-button">
          <span>🔍</span>
        </button>
      </form>

      {warning && <p className="search-warning">{warning}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((prod, idx) => (
            <li
              key={prod.id}
              className={`suggestion-item ${selectedIndex === idx ? "active" : ""}`}
              onClick={() => handleSuggestionClick(prod)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <img src={prod.image} alt={prod.title} className="suggestion-img" />
              <div className="suggestion-info">
                <span className="suggestion-title">{prod.title}</span>
                <span className="suggestion-price">${prod.price}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
