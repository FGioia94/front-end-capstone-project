import { Button, Form } from "react-bootstrap";
const ControlPanel = ({ score, speed, setSpeed }) => {
  return (
    <>
      <h2>Score: {String(score).padStart(3, "0")}</h2>
      <Form.Label>Range</Form.Label>
      <Form.Range
        value={speed}
        min={1}
        max={20}
        onChange={(e) => setSpeed(Number(e.target.value))}
      />
      {/* <Button onClick={restartGame}></Button> */}
    </>
  );
};
export default ControlPanel;
