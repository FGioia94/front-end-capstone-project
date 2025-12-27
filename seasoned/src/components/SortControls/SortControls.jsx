import { Form } from "react-bootstrap";
import "./SortControls.css";

const SortControls = ({ sortBy, setSortBy }) => {
  return (
    <div className="sort-controls">
      <label htmlFor="sort-select" className="sort-label">
        Sort by:
      </label>
      <Form.Select
        id="sort-select"
        className="sort-select"
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
      >
        <option value="default">Default</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="price-asc">Price (Low to High)</option>
        <option value="price-desc">Price (High to Low)</option>
      </Form.Select>
    </div>
  );
};

export default SortControls;
