import "./Player.css";
import { useEffect } from "react";

const Player = ({ playerPos, setPlayerPos }) => {
  useEffect(() => {
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
  }, [setPlayerPos]);

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