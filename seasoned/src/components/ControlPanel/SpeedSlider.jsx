import { Form } from "react-bootstrap";
import { useMemo } from "react";
import "./SpeedSlider.css";

const SpeedSlider = ({ speed, setSpeed }) => {
  const MIN_SPEED = 0.1;
  const MAX_SPEED = 5;

  const trackFill = useMemo(() => {
    const span = MAX_SPEED - MIN_SPEED;
    const pct = ((speed - MIN_SPEED) / span) * 100;
    return `linear-gradient(90deg, #e5e7eb ${pct}%, #f472b6 ${pct}%)`;
  }, [speed]);

  return (
    <div className="speed-slider">
      <div className="speed-slider__label">
        <span>Speed Slider</span>
        <span className="speed-slider__value">{speed.toFixed(2)}x</span>
      </div>

      <div className="speed-track">
        <div className="speed-track__fill" style={{ background: trackFill }} />

        <Form.Range
          aria-label="Game speed"
          className="speed-thumb"
          value={speed}
          min={MIN_SPEED}
          max={MAX_SPEED}
          step={0.01}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export default SpeedSlider;
