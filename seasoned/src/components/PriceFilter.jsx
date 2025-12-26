import { Form } from "react-bootstrap";
import { useState } from "react";
const PriceFilter = ({ filterPrice, setFilterPrice }) => {
  const [tempMin, setTempMin] = useState(filterPrice[0]);
  const [tempMax, setTempMax] = useState(filterPrice[1]);
  const handleMinChange = (e) => {
    setTempMin(Number(e.target.value));
  };

  const commitMin = () => {
    setFilterPrice([tempMin, filterPrice[1]]);
  };
  const handleMaxChange = (e) => {
    setTempMax(Number(e.target.value));
  };

  const commitMax = () => {
    setFilterPrice([filterPrice[0], tempMax]);
  };
  return (
    <>
      <Form.Label>Min Price: ${" "}{(filterPrice[0] / 100).toFixed(2)}</Form.Label>
      <Form.Range
        value={tempMin}
        min={795}
        max={filterPrice[1]}
        step={1}
        onChange={handleMinChange}
        onMouseUp={commitMin}
      />

      <Form.Label>Max Price: ${" "}{(filterPrice[1] / 100).toFixed(2)}</Form.Label>
      <Form.Range
        value={tempMax}
        min={filterPrice[0]}
        max={100000}
        step={1}
        onChange={handleMaxChange}
        onMouseUp={commitMax}
      />
    </>
  );
};

export default PriceFilter;
