import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect, useRef } from "react";
import { mulberry32, remap } from "../../utils/mathUtils.js";
import Player from "../Player/Player.jsx";
import "./GameField.css";
import ControlPanel from "../ControlPanel/ControlPanel.jsx";

const GameField = () => {
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [products, setProducts] = useState([]);
  const [gameMode, setGameMode] = useState(false);
  const [positions, setPositions] = useState({});
  const [sizes, setSizes] = useState({});
  const [score, setScore] = useState(0);
  const [pause, setPause] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [playerPos, setPlayerPos] = useState({
    x: containerSize.width / 2,
    y: containerSize.height - 1,
  });

  const [speed, setSpeed] = useState(1);
  const [highScore, setHighScore] = useState(0);

  const updatePosition = (id, pos) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  };

  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    setPlayerPos({
      x: containerSize.width / 2,
      y: containerSize.height - 50, // give the player some height
    });
  }, [containerSize]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://fakestoreapi.com/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const getCardSize = (price) => {
    let remappedValue;
    if (price < 50) {
      remappedValue = remap(price, 0, 50, 150, 300);
    } else if (price >= 50 && price <= 400) {
      remappedValue = remap(price, 50, 400, 300, 400);
    } else {
      remappedValue = 500;
    }
    return { height: remappedValue * 0.6, width: remappedValue * 0.4 };
  };

  const updateSize = (id, size) => {
    setSizes((prev) => ({ ...prev, [id]: size }));
  };

  const updateCardSizes = () => {
    products.forEach((prod) => {
      updateSize(prod.id, getCardSize(prod.price));
    });
  };

  useEffect(() => {
    updateCardSizes();
  }, [products]);

  // Measure container size and update on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setContainerSize({ width: rect.width, height: rect.height });
      }
    };

    updateSize();
    // window.addEventListener("resize", updateSize);

    // return () => window.removeEventListener("resize", updateSize);
  }, []);

  const backgroundURL = gameMode
    ? "https://source.unsplash.com/random/1080x1920/?nature"
    : "";

  const generateRandomPositions = (element, maxHeight, maxWidth) => {
    const x = mulberry32(element.id)() * Math.random();
    const y = mulberry32(element.id + 1)() * Math.random();
    const posX = Math.floor(x * maxWidth - sizes[element.id].width);
    const posY = Math.floor(y * maxHeight - sizes[element.id].height);

    return { x: posX, y: posY };
  };

  // Collision detection (AABB)
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

            // Clamp positions inside the game field bounds
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

    if (iteration === maxIterations) {
      console.warn("Max collision resolution iterations reached");
    }

    return finalPositions;
  };

  const initializeGame = () => {
    if (Object.keys(sizes).length === 0) {
      // NOTE FOR REFACTORING STAGE - CHECK BETTER LOGGING OPTIONS THAT ALLOWS FOR DIFFERENT VERBOSITIES
      console.log("Waiting for sizes to initialize positions...");
      return;
    }

    const maxWidth = containerSize.width;
    const maxHeight = containerSize.height;

    if (maxWidth === 0 || maxHeight === 0) {
      // container size not ready yet
      return;
    }

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
      sizes,
      maxWidth,
      maxHeight
    );
    setPositions(finalPositions);
  };
  const move = (amount) => {
    products.forEach((prod) => {
      const currentPos = positions[prod.id];
      const size = sizes[prod.id];

      // If position or size not ready yet, skip this product
      if (!currentPos || !size) return;

      const newPos = {
        x: currentPos.x,
        y: currentPos.y + amount * speed,
      };

      updatePosition(prod.id, newPos);
    });
  };

  useEffect(() => {
    if (!gameMode) return;

    let animationFrameId;

    const loop = () => {
      move(1); // move 5px per frame

      products.forEach((prod) => {
        if (!sizes[prod.id] || !positions[prod.id]) return;

        // collision with player
        if (
          isColliding(
            playerPos,
            { x: 50, y: 10 },
            positions[prod.id],
            sizes[prod.id]
          )
        ) {
          console.log("PLAYER COLLISION");
        }

        // respawn if off screen
        if (positions[prod.id].y >= containerSize.height) {
          let attempts = 0;
          do {
            updatePosition(prod.id, {
              x: Math.random() * containerSize.width,
              y: (Math.random() * containerSize.width) / 3,
            });
            attempts++;
            console.log("resolve");
          } while (
            // check against ALL other products
            products.some(
              (p) =>
                p.id !== prod.id &&
                isColliding(
                  positions[prod.id],
                  sizes[prod.id],
                  positions[p.id],
                  sizes[p.id]
                )
            ) &&
            attempts < 2000
          );

          setScore((prev) => prev + 1);
        }
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    gameMode,
    products,
    positions,
    sizes,
    containerSize,
    playerPos,
    move,
    updatePosition,
    setScore,
  ]);

  useEffect(() => {
    if (gameMode && Object.keys(sizes).length === products.length) {
      initializeGame();
    }
  }, [gameMode, sizes, containerSize]); // add containerSize so positions update when size changes

  return (
    <>
      {gameMode ? (
        <ControlPanel
          score={score}
          speed={speed}
          setSpeed={setSpeed}
        ></ControlPanel>
      ) : (
        <></>
      )}
      <div
        ref={containerRef}
        id="game-field"
        className={gameMode ? "game-display" : "product-display"}
        style={{ backgroundImage: `url(${backgroundURL})` }}
      >
        {products.map((prod) => (
          <ProductCard
            key={prod.id}
            position={positions[prod.id]}
            size={sizes[prod.id]}
            prod={prod}
            gameMode={gameMode}
          />
        ))}
      </div>
      {gameMode ? <hr></hr> : <></>}
      {gameMode ? <br></br> : <></>}
      <button
        onClick={() => {
          setGameMode(!gameMode);
        }}
      >
        {gameMode ? "Product Mode" : "Game Mode"}
      </button>
      {gameMode ? (
        <Player playerPos={playerPos} setPlayerPos={setPlayerPos}></Player>
      ) : (
        ""
      )}
    </>
  );
};

export default GameField;
