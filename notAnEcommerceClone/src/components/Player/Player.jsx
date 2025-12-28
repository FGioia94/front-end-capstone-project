import "./Player.css";
import { useEffect, useRef } from "react";

const Player = ({ playerPos, setPlayerPos, isPaused, gameOver }) => {
  /*
  * This component represents the player character in the game.
  * It handles player movement via arrow keys on desktop and touch/drag on mobile. 
  * 
  * @param {object} playerPos - The current position of the player.
  * @param {function} setPlayerPos - Function to update the player's position.
  * @param {boolean} isPaused - Indicates if the game is currently paused.
  * @param {boolean} gameOver - Indicates if the game is over.
  * @returns {JSX.Element} The player component.
  */
  const touchStartX = useRef(null);

  useEffect(() => {
    // Don't allow movement if game is paused or over
    if (isPaused || gameOver) return;

    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // Touch/drag control for mobile
      const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
      };

      const handleTouchMove = (e) => {
        if (touchStartX.current === null) return;
        const currentX = e.touches[0].clientX;
        const diffX = currentX - touchStartX.current;

        setPlayerPos((prevPos) => ({
          x: prevPos.x + diffX * 0.5,
          y: prevPos.y,
        }));

        touchStartX.current = currentX;
      };

      const handleTouchEnd = () => {
        touchStartX.current = null;
      };

      // Attach touch event listeners
      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        // Cleanup touch event listeners
        document.removeEventListener("touchstart", handleTouchStart);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    } else {
      // Arrow key control for desktop
      const handleKeyDown = (event) => {
        setPlayerPos((prevPos) => {
          const STEP = 30;

          if (event.key === "ArrowLeft") {
            return { x: prevPos.x - STEP, y: prevPos.y };
          } else if (event.key === "ArrowRight") {
            return { x: prevPos.x + STEP, y: prevPos.y };
          }
          return prevPos;
        });
      };

      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [setPlayerPos, isPaused, gameOver]);

  return (
    <div
      id="player"
      style={{
        "--player-x": `${playerPos.x}px`,
        "--player-y": `${playerPos.y}px`,
      }}
    />
  );
};

export default Player;
