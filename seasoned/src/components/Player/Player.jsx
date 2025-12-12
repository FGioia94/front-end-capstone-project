import "./Player.css";
import { useState } from "react";

const Player = ({ containerSize }) => {
  const [playerPos, setPlayerPos] = useState({
    x: containerSize.width / 2,
    y: containerSize.height - 1,
  });

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
