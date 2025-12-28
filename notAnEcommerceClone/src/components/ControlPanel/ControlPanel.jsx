import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser, selectIsLoggedIn, selectIsAdmin } from "../../store/slices/userSlice";
import { getHighscore, saveHighscore } from "../../utils/highscoreUtils";
import SpeedSlider from "../SpeedSlider/SpeedSlider";
import PriceFilter from "../PriceFilter/PriceFilter";
import "./ControlPanel.css";

const ControlPanel = ({
  score,
  speed,
  setSpeed,
  gameOver,
  filterPrice,
  setFilterPrice,
}) => {
  
  /*
   * This component renders the control panel for the game.
   * It displays the current score, highscore, and user information.
   * If the user is an admin, it also provides a speed control slider.
   * Additionally, it includes a price filter for products.
   *
   * @param {number} score - The current score of the game.
   * @param {number} speed - The current speed setting of the game.
   * @param {function} setSpeed - Function to update the speed setting. 
   * @param {boolean} gameOver - Indicates if the game is over.
   * @param {number} filterPrice - The current price filter value.
   * @param {function} setFilterPrice - Function to update the price filter.
   * @returns {JSX.Element} The control panel component.
   */


  const user = useSelector(selectUser);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isAdmin = useSelector(selectIsAdmin);
  const [highscore, setHighscore] = useState(0);

  // Save highscore when game ends
  useEffect(() => {

    // Update highscore if game is over and user is logged in
    if (gameOver && isLoggedIn) {
      saveHighscore(user.username, score);
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
