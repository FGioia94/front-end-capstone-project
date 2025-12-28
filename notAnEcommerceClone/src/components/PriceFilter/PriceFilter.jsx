import { Form } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
import "./PriceFilter.css";

// multiplying by 100 to avoid float precision issues, it was flickering before
const MIN_BOUND = 795; 
const MAX_BOUND = 100000; 

const clampRange = (minIn, maxIn) => {
  /* Clamp the input range to be within the defined bounds and ensure min is always less than max */
  const min = Math.max(MIN_BOUND, Math.min(minIn, maxIn - 1));
  const max = Math.min(MAX_BOUND, Math.max(maxIn, min + 1));
  return { min, max };
};

const PriceFilter = ({ filterPrice, setFilterPrice }) => {
  /*
  * This component provides a dual slider for filtering products by price.
  * It allows users to select a minimum and maximum price within defined bounds.
  *
  * @param {number[]} filterPrice - The current price filter as [min, max].
  * @param {function} setFilterPrice - Function to update the price filter.
  * @returns {JSX.Element} The price filter component.
  */
  const [range, setRange] = useState(() => clampRange(filterPrice[0], filterPrice[1]));

  // keep local state in sync with external filter changes, without looping
  useEffect(() => {
    const next = clampRange(filterPrice[0], filterPrice[1]);
    // Only update if there's an actual change
    setRange((prev) => (prev.min !== next.min || prev.max !== next.max ? next : prev));
  }, [filterPrice]);

  // Handlers for slider changes
  const handleMinChange = (value) => {
    setRange((prev) => {
      const next = clampRange(value, prev.max);
      if (next.min !== prev.min) {
        setFilterPrice([next.min, next.max]);
      }
      return next;
    });
  };

  const handleMaxChange = (value) => {
    setRange((prev) => {
      const next = clampRange(prev.min, value);
      if (next.max !== prev.max) {
        setFilterPrice([next.min, next.max]);
      }
      return next;
    });
  };

  // Calculate the background fill for the track between the two thumbs using useMemo for performance
  const trackFill = useMemo(() => {
    const span = MAX_BOUND - MIN_BOUND;
    const minPct = ((range.min - MIN_BOUND) / span) * 100;
    const maxPct = ((range.max - MIN_BOUND) / span) * 100;
    return `linear-gradient(90deg, #e5e7eb ${minPct}%, #c7d2fe ${minPct}%, #c7d2fe ${maxPct}%, #e5e7eb ${maxPct}%)`;
  }, [range.min, range.max]);

  return (
    <div className="price-filter">
      <div className="price-filter__labels">
        <Form.Label>Min: ${(range.min / 100).toFixed(2)}</Form.Label>
        <Form.Label>Max: ${(range.max / 100).toFixed(2)}</Form.Label>
      </div>

      <div className="dual-slider">
        <div className="dual-track" style={{ background: trackFill }} />

        <Form.Range
          aria-label="Minimum price"
          className="range-thumb range-thumb--min"
          value={range.min}
          min={MIN_BOUND}
          max={range.max - 1}
          step={1}
          onChange={(e) => handleMinChange(Number(e.target.value))}
        />

        <Form.Range
          aria-label="Maximum price"
          className="range-thumb range-thumb--max"
          value={range.max}
          min={range.min + 1}
          max={MAX_BOUND}
          step={1}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default PriceFilter;
