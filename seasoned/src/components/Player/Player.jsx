import "./Player.css";
import { useEffect, useRef } from "react";

const Player = ({ playerPos, setPlayerPos, isPaused, gameOver }) => {
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

      document.addEventListener("touchstart", handleTouchStart);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
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
