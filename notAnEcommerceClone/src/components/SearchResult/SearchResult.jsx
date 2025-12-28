import { useLocation } from "react-router";
import { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../../store/slices/cartSlice";
import ProductCard from "../ProductCard/ProductCard";
import SortControls from "../SortControls/SortControls";
import "./SearchResult.css";

const SearchResult = () => {
  /* 
    * This component displays search results based on query parameters.
  */
  const [sortBy, setSortBy] = useState("default");
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const dispatch = useDispatch();
  
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchText = params.get("q");
    
  if (loading || !products || products.length === 0) {
    return <p>Loading...</p>;
  }
  
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  // Memoized computation of matching products based on search text and sorting
  const matchingProducts = useMemo(() => {
    let result = products.filter((prod) => {
      return (
        prod.title.toLowerCase().includes(searchText.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [products, searchText, sortBy]);

  return (
    <div className="search-result-wrapper">
      <div className="search-result-header">
        <div className="search-result-title-section">
          <h1 className="search-result-title">Search Results</h1>
          <p className="search-result-query">for <span>"{searchText}"</span></p>
          <span className="search-result-count">{matchingProducts.length} {matchingProducts.length === 1 ? 'product' : 'products'} found</span>
        </div>
        <div className="search-result-controls">
          <SortControls sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      </div>
      <div className="search-results-grid">
        {matchingProducts.length > 0 ? (
          matchingProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              position={{}}
              size={1}
              prod={prod}
              gameMode={false}
              addToCart={handleAddToCart}
            />
          ))
        ) : (
          <div className="search-empty-state">
            <span className="empty-icon">🔍</span>
            <h3>No products found</h3>
            <p>Try searching with different keywords</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResult;
