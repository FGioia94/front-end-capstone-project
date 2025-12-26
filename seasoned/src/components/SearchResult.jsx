import { useLocation } from "react-router";
import ProductCard from "./ProductCard/ProductCard";
const SearchResult = ({ products, setCart}) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const searchText = params.get("q");
  console.log(searchText);
  if (!products || products.length === 0) {
    return <p>Loading...</p>;
  }
  const matchingProducts = products.filter((prod) => {
    return (
      prod.title.toLowerCase().includes(searchText.toLowerCase()) ||
      prod.description.toLowerCase().includes(searchText.toLowerCase())
    );
  });

  return (
    <>
      {matchingProducts.map((prod) => (
        <ProductCard
          key={prod.id}
          position={{}}
          size={1}
          prod={prod}
          gameMode={false}
          setCart={setCart}
        ></ProductCard>
      ))}
    </>
  );
};

export default SearchResult;
