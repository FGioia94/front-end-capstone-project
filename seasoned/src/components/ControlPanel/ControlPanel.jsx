import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn, selectIsAdmin } from "../../store/slices/userSlice";
import { getHighscore, saveHighscore } from "../../utils/highscoreUtils";
import SpeedSlider from "./SpeedSlider";
import PriceFilter from "../PriceFilter";
import "./ControlPanel.css";

const ControlPanel = ({
  score,
  speed,
  setSpeed,
  gameOver,
  filterPrice,
  setFilterPrice,
}) => {
  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin = useSelector(selectIsAdmin);
  const [highscore, setHighscore] = useState(0);

  // Save highscore when game ends
  useEffect(() => {
    if (gameOver && isLoggedIn) {
      const isNew = saveHighscore(user.username, score);
      setHighscore(getHighscore(user.username));
    } else if (isLoggedIn) {
      setHighscore(getHighscore(user.username));
    }
  }, [gameOver, score, isLoggedIn, user]);

  return (
    <div className="control-panel-container">
      <div className="control-panel-score">
        <h2>Score: {String(score).padStart(3, "0")}</h2>
        
        <div className="control-panel-highscore">
          {isLoggedIn ? (
            <>
              <span>Highscore: {String(highscore).padStart(3, "0")}</span>
              {user && <span className="user-badge">{user.username}</span>}
            </>
          ) : (
            <p className="highscore-message">
              ⭐ Highscores recorded only for signed-in users. 
              <a href="/register"> Register</a> to use this feature!
            </p>
          )}
        </div>
      </div>
      
      {isAdmin && (
        <SpeedSlider speed={speed} setSpeed={setSpeed} />
      )}
      
      <div className="control-panel-section">
        <PriceFilter filterPrice={filterPrice} setFilterPrice={setFilterPrice} />
      </div>
      
      {!isAdmin && isLoggedIn && (
        <p className="control-panel-note">⚠️ Speed control: Admin only</p>
      )}
      
      {!isLoggedIn && (
        <p className="control-panel-note">⚠️ Speed control: Sign in as Admin</p>
      )}
    </div>
  );
};
export default ControlPanel;
