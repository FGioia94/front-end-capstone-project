import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect, useRef } from "react";
import { mulberry32, remap } from "../../utils/mathUtils.js";
import Player from "../Player/Player.jsx";
import "./GameField.css";
import ControlPanel from "../ControlPanel/ControlPanel.jsx";
import { Form } from "react-bootstrap";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 10;

const GameField = ({
  products,
  setProducts,
  setCart,
  filterPrice,
  setFilterPrice,
}) => {
  const containerRef = useRef(null);

  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  const [gameMode, setGameMode] = useState(false);
  const [positions, setPositions] = useState({});
  const [sizes, setSizes] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(1);

  const positionsRef = useRef({});
  const sizesRef = useRef({});
  const playerPosRef = useRef(playerPos);
  const speedRef = useRef(speed);
  const gameOverRef = useRef(gameOver);

  const filteredProducts = products.filter(
    (p) => p.price >= filterPrice[0] / 100 && p.price <= filterPrice[1] / 100
  );
  
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  useEffect(() => {
    sizesRef.current = sizes;
  }, [sizes]);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    gameOverRef.current = gameOver;
  }, [gameOver]);

  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({
          width: rect.width,
          height: rect.height,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    setPlayerPos({
      x: containerSize.width / 2 - PLAYER_WIDTH / 2,
      y: containerSize.height - PLAYER_HEIGHT - 5,
    });
  }, [containerSize]);

  const getCardSize = (price) => {
    let remappedValue;
    if (price < 50) {
      remappedValue = remap(price, 0, 50, 150, 300);
    } else if (price <= 400) {
      remappedValue = remap(price, 50, 400, 300, 400);
    } else {
      remappedValue = 500;
    }
    return {
      height: remappedValue * 0.3,
      width: remappedValue * 0.2,
    };
  };

  const updateSize = (id, size) => {
    setSizes((prev) => {
      const next = { ...prev, [id]: size };
      sizesRef.current = next;
      return next;
    });
  };

  const updateCardSizes = () => {
    filteredProducts.forEach((prod) => {
      updateSize(prod.id, getCardSize(prod.price));
    });
  };

  useEffect(() => {
    updateCardSizes();
  }, [products]);

  const generateRandomPositions = (element, maxHeight, maxWidth) => {
    const size = sizesRef.current[element.id];
    if (!size) return { x: 0, y: 0 };

    const x = mulberry32(element.id)() * Math.random();
    const y = mulberry32(element.id + 1)() * Math.random();

    const rawX = x * maxWidth;
    const rawY = y * maxHeight;

    const posX = Math.max(0, Math.min(rawX, maxWidth - size.width));
    const posY = Math.max(0, Math.min(rawY, maxHeight - size.height));

    return { x: Math.floor(posX), y: Math.floor(posY) };
  };

  const isColliding = (posA, sizeA, posB, sizeB) => {
    if (!posA || !posB || !sizeA || !sizeB) return false;
    return !(
      posA.x + sizeA.width < posB.x ||
      posA.x > posB.x + sizeB.width ||
      posA.y + sizeA.height < posB.y ||
      posA.y > posB.y + sizeB.height
    );
  };

  const resolveCollisions = (initialPositions, sizes, maxWidth, maxHeight) => {
    const finalPositions = { ...initialPositions };
    const keys = Object.keys(finalPositions);

    if (keys.length === 0) return finalPositions;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const padding = 100;
    let iteration = 0;
    const maxIterations = 9000;
    let collisionsExist = true;

    while (collisionsExist && iteration < maxIterations) {
      collisionsExist = false;

      for (let i = 0; i < keys.length; i++) {
        const keyA = keys[i];

        for (let j = i + 1; j < keys.length; j++) {
          const keyB = keys[j];

          let posA = finalPositions[keyA];
          let posB = finalPositions[keyB];

          if (isColliding(posA, sizes[keyA], posB, sizes[keyB])) {
            collisionsExist = true;

            const ax1 = posA.x;
            const ay1 = posA.y;
            const ax2 = posA.x + sizes[keyA].width;
            const ay2 = posA.y + sizes[keyA].height;

            const bx1 = posB.x;
            const by1 = posB.y;
            const bx2 = posB.x + sizes[keyB].width;
            const by2 = posB.y + sizes[keyB].height;

            const overlapX = Math.min(ax2, bx2) - Math.max(ax1, bx1);
            const overlapY = Math.min(ay2, by2) - Math.max(ay1, by1);

            if (overlapX < overlapY) {
              const shiftX = (overlapX + padding) / 2;
              posA.x -= posA.x < posB.x ? shiftX : -shiftX;
              posB.x += posA.x < posB.x ? shiftX : -shiftX;
            } else {
              const shiftY = (overlapY + padding) / 2;
              posA.y -= posA.y < posB.y ? shiftY : -shiftY;
              posB.y += posA.y < posB.y ? shiftY : -shiftY;
            }

            posA.x = clamp(posA.x, 0, maxWidth - sizes[keyA].width);
            posA.y = clamp(posA.y, 0, maxHeight - sizes[keyA].height);
            posB.x = clamp(posB.x, 0, maxWidth - sizes[keyB].width);
            posB.y = clamp(posB.y, 0, maxHeight - sizes[keyB].height);

            finalPositions[keyA] = { ...posA };
            finalPositions[keyB] = { ...posB };
          }
        }
      }

      iteration++;
    }

    return finalPositions;
  };

  const initializeGame = () => {
    if (Object.keys(sizesRef.current).length === 0) return;

    const maxWidth = containerSize.width;
    const maxHeight = containerSize.height;

    if (maxWidth === 0 || maxHeight === 0) return;

    const initialPositions = {};
    products.forEach((product) => {
      initialPositions[product.id] = generateRandomPositions(
        product,
        maxHeight,
        maxWidth
      );
    });

    const finalPositions = resolveCollisions(
      initialPositions,
      sizesRef.current,
      maxWidth,
      maxHeight
    );

    positionsRef.current = finalPositions;
    setPositions(finalPositions);
    setScore(0);
    setGameOver(false);
  };

  const moveAll = () => {
    const currentPositions = { ...positionsRef.current };
    const currentSizes = sizesRef.current;
    const currentSpeed = speedRef.current;

    filteredProducts.forEach((prod) => {
      const currentPos = currentPositions[prod.id];
      const size = currentSizes[prod.id];
      if (!currentPos || !size) return;

      const newPos = {
        x: currentPos.x,
        y: currentPos.y + 1 * currentSpeed,
      };

      currentPositions[prod.id] = newPos;
    });

    positionsRef.current = currentPositions;
    setPositions(currentPositions);
  };

  useEffect(() => {
    if (!gameMode) return;

    let animationFrameId;

    const loop = () => {
      if (gameOverRef.current) return;

      moveAll();

      const currentPositions = positionsRef.current;
      const currentSizes = sizesRef.current;
      const currentPlayerPos = playerPosRef.current;

      const playerHitboxPos = {
        x: currentPlayerPos.x,
        y: currentPlayerPos.y,
      };
      const playerHitboxSize = {
        width: PLAYER_WIDTH,
        height: PLAYER_HEIGHT,
      };

      let collisionThisFrame = false;

      filteredProducts.forEach((prod) => {
        const prodPos = currentPositions[prod.id];
        const prodSize = currentSizes[prod.id];
        if (!prodPos || !prodSize) return;

        if (isColliding(playerHitboxPos, playerHitboxSize, prodPos, prodSize)) {
          collisionThisFrame = true;
        }

        if (prodPos.y >= containerSize.height - prodSize.height) {
          let attempts = 0;
          let newPos;
          const maxAttempts = 2000;

          do {
            const randomX =
              Math.random() * (containerSize.width - prodSize.width);
            const randomY =
              Math.random() * (containerSize.height / 3 - prodSize.height);

            newPos = {
              x: Math.max(0, randomX),
              y: Math.max(0, randomY),
            };

            currentPositions[prod.id] = newPos;

            attempts++;
          } while (
            filteredProducts.some((p) => {
              if (p.id === prod.id) return false;
              const otherPos = currentPositions[p.id];
              const otherSize = currentSizes[p.id];
              if (!otherPos || !otherSize) return false;
              return isColliding(newPos, prodSize, otherPos, otherSize);
            }) &&
            attempts < maxAttempts
          );

          positionsRef.current = currentPositions;
          setPositions({ ...currentPositions });

          setScore((prev) => prev + 1);
        }
      });

      if (collisionThisFrame) {
        setGameOver(true);
        gameOverRef.current = true;
        return;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, filterPrice, containerSize]);

  useEffect(() => {
    if (gameMode && Object.keys(sizes).length === filteredProducts.length) {
      initializeGame();
    }
  }, [gameMode, sizes, containerSize, products]);
  console.log("RENDER GAMEFIELD");
  return (
    <div className={gameMode ? "no-scroll game-mode-layout" : ""}>
      {gameMode && (
        <ControlPanel score={score} speed={speed} setSpeed={setSpeed} />
      )}

      <div
        ref={containerRef}
        id="game-field"
        className={gameMode ? "game-display" : "product-display"}
      >
        {filteredProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            position={positions[prod.id]}
            size={sizes[prod.id]}
            prod={prod}
            gameMode={gameMode}
            setCart={setCart}
          />
        ))}
        {gameMode && (
          <Player playerPos={playerPos} setPlayerPos={setPlayerPos} />
        )}
      </div>

      <button
        onClick={() => {
          if (!gameMode) initializeGame();
          setGameMode(!gameMode);
        }}
      >
        {gameMode ? "Product Mode" : "Game Mode"}
      </button>

      {gameOver && gameMode && <h2>GAME OVER</h2>}
    </div>
  );
};

export default GameField;
