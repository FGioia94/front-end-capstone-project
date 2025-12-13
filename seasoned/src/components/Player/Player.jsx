import "./Player.css";
import { useState, useEffect } from "react";

const Player = ({ playerPos, setPlayerPos }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      setPlayerPos((prevPos) => {
        if (event.key === "ArrowLeft") {
          return { x: prevPos.x - 10, y: prevPos.y };
        } else if (event.key === "ArrowRight") {
          return { x: prevPos.x + 10, y: prevPos.y };
        }
        return prevPos; // unchanged if other keys
      });
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  console.log("player");

  return (
    <>
      <div
        id="player"
        style={{
          "--player-x": `${playerPos.x}px`,
          "--player-y": `${playerPos.y}px`,
        }}
      >
        hello
      </div>
    </>
  );
};

export default Player;
