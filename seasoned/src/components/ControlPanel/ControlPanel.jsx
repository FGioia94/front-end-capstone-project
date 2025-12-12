import { Button, Form } from "react-bootstrap";
const ControlPanel = ({ score, setSpeed, restartGame }) => {
  return (
    <>
      <h2>Score: {String(score).padStart(3, "0")}</h2>
      <Form.Label>Range</Form.Label>
      <Form.Range />
      <Button onClick={restartGame}></Button>
    </>
  );
};
export default ControlPanel;
