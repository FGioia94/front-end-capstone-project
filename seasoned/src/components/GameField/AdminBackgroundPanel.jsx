import { useUser } from "../../context/UserContext";
import "./AdminBackgroundPanel.css";

const AdminBackgroundPanel = ({ palette, setPalette, opacity, setOpacity }) => {
  const { isAdmin } = useUser();

  if (!isAdmin) return null;

  const paletteNames = {
    vibrant: "Vibrant",
    cool: "Cool",
    warm: "Warm",
    sunset: "Sunset",
    forest: "Forest",
  };

  return (
    <div className="admin-bg-panel">
      <h3 className="admin-bg-title">🎨 Background</h3>

      <div className="admin-bg-section">
        <label className="admin-bg-label">Palette</label>
        <div className="palette-buttons">
          {Object.entries(paletteNames).map(([key, name]) => (
            <button
              key={key}
              className={`palette-btn ${palette === key ? "active" : ""}`}
              onClick={() => setPalette(key)}
              title={name}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-bg-section">
        <div className="opacity-label">
          <label className="admin-bg-label">Opacity</label>
          <span className="opacity-value">{(opacity * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={opacity}
          onChange={(e) => setOpacity(parseFloat(e.target.value))}
          className="opacity-slider"
        />
      </div>
    </div>
  );
};

export default AdminBackgroundPanel;
