import { Button, Form } from "react-bootstrap";
import { useState } from "react";

const ControlPanel = ({
  score,
  speed,
  setSpeed,
}) => {


  return (
    <>
      <h2>Score: {String(score).padStart(3, "0")}</h2>
      <Form.Label>Range</Form.Label>
      <Form.Range
        value={speed}
        min={0.1}
        max={5}
        step={0.01}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      

      {/* <Button onClick={restartGame}></Button> */}
    </>
  );
};
export default ControlPanel;
