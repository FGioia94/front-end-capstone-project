import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect, useRef, useMemo } from "react";
import { useUser } from "../../context/UserContext";
import { mulberry32, remap } from "../../utils/mathUtils.js";
import Player from "../Player/Player.jsx";
import "./GameField.css";
import ControlPanel from "../ControlPanel/ControlPanel.jsx";
import SortControls from "../SortControls/SortControls.jsx";
import AdminBackgroundPanel from "./AdminBackgroundPanel.jsx";
import { Form } from "react-bootstrap";

const PLAYER_WIDTH = 50;
const PLAYER_HEIGHT = 10;

const GameField = ({
  products,
  setProducts,
  setCart,
  filterPrice,
  setFilterPrice,
  addToCart,
}) => {
  const { isAdmin } = useUser();

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
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [adminBgPalette, setAdminBgPalette] = useState("vibrant");
  const [adminBgOpacity, setAdminBgOpacity] = useState(0.7);

  // Only allow speed to be used if user is admin
  const actualSpeed = isAdmin ? speed : 1;

  const containerRef = useRef(null);
  const positionsRef = useRef({});
  const sizesRef = useRef({});
  const playerPosRef = useRef(playerPos);
  const speedRef = useRef(actualSpeed);
  const gameOverRef = useRef(gameOver);

  // Create a safe setSpeed that only allows admins to change speed
  const safeSetSpeed = (newSpeed) => {
    if (isAdmin) {
      setSpeed(newSpeed);
    }
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(
      (p) => p.price >= filterPrice[0] / 100 && p.price <= filterPrice[1] / 100
    );

    // Apply sorting
    switch (sortBy) {
      case "name-asc":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return result;
  }, [products, filterPrice, sortBy]);

  const loading = products.length === 0;
  
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
    // Generate an abstract gradient background (no external images)
    // For admins in game mode, use custom palette; otherwise use random
    const generateAdminGradient = (palette, opacity) => {
      const palettes = {
        vibrant: [
          { h: 280, s: 85, l: 55 },
          { h: 0, s: 90, l: 60 },
          { h: 40, s: 95, l: 50 },
        ],
        cool: [
          { h: 200, s: 85, l: 55 },
          { h: 240, s: 80, l: 50 },
          { h: 270, s: 75, l: 55 },
        ],
        warm: [
          { h: 25, s: 90, l: 55 },
          { h: 0, s: 85, l: 60 },
          { h: 45, s: 88, l: 50 },
        ],
        sunset: [
          { h: 340, s: 92, l: 60 },
          { h: 20, s: 95, l: 55 },
          { h: 50, s: 90, l: 50 },
        ],
        forest: [
          { h: 120, s: 70, l: 40 },
          { h: 150, s: 65, l: 45 },
          { h: 90, s: 60, l: 35 },
        ],
      };

      const colors = palettes[palette] || palettes.vibrant;
      return `linear-gradient(135deg, hsla(${colors[0].h}, ${colors[0].s}%, ${colors[0].l}%, ${opacity}), hsla(${colors[1].h}, ${colors[1].s}%, ${colors[1].l}%, ${opacity}), hsla(${colors[2].h}, ${colors[2].s}%, ${colors[2].l}%, ${opacity}))`;
    };

    if (gameMode && isAdmin) {
      const gradient = generateAdminGradient(adminBgPalette, adminBgOpacity);
      setBackgroundImage(gradient);
    } else {
      // Use random gradient for non-admin or product mode
      const randHue = () => Math.floor(Math.random() * 360);
      const h1 = randHue();
      const h2 = (h1 + 60 + Math.random() * 80) % 360;
      const h3 = (h2 + 80 + Math.random() * 60) % 360;
      const gradient = `linear-gradient(135deg, hsla(${h1}, 82%, 58%, 0.85), hsla(${h2}, 78%, 55%, 0.9), hsla(${h3}, 72%, 52%, 0.9))`;
      setBackgroundImage(gradient);
    }
    setBackgroundImageLoaded(true);
  }, [gameMode, isAdmin, adminBgPalette, adminBgOpacity]);

  useEffect(() => {
    // kept intentionally empty - resize handler is declared at top-level now
  }, []);

  // updateContainerSize is used in multiple places (initial measurement,
  // on resize, and when switching modes) so keep it at component scope.
  const updateContainerSize = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    }
  };

  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  // Recompute container size when switching between product/game mode so
  // positioning uses the correct available area.
  useEffect(() => {
    // allow layout to settle (class changes may affect flow)
    const t = setTimeout(() => updateContainerSize(), 0);
    return () => clearTimeout(t);
  }, [gameMode, filteredProducts.length]);

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
    
    // Minimal scaling on mobile
    const isMobile = window.innerWidth <= 768;
    const scale = isMobile ? 0.7 : 1;
    
    return {
      height: remappedValue * 0.3 * scale,
      width: remappedValue * 0.2 * scale,
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
        <ControlPanel score={score} speed={speed} setSpeed={safeSetSpeed} gameOver={gameOver} />
      )}

      {gameMode && isAdmin && (
        <AdminBackgroundPanel
          palette={adminBgPalette}
          setPalette={setAdminBgPalette}
          opacity={adminBgOpacity}
          setOpacity={setAdminBgOpacity}
        />
      )}

      {!gameMode && (
        <div className="product-controls">
          <SortControls sortBy={sortBy} setSortBy={setSortBy} />
        </div>
      )}

      <div
        ref={containerRef}
        id="game-field"
        style={{ '--game-bg': backgroundImage }}
        className={gameMode ? "game-display" : "product-display"}
      >
        {loading && !gameMode ? (
          // show skeletons while loading
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="product-card skeleton" />
          ))
        ) : (
          filteredProducts.map((prod, i) => {
            const pos = positions[prod.id];
            const size = sizes[prod.id];
            let danger = 0;
            if (gameMode && pos && size && containerSize.width && containerSize.height) {
              const cardCenterX = pos.x + (size.width || 0) / 2;
              const cardCenterY = pos.y + (size.height || 0) / 2;
              const playerCenterX = playerPos.x + PLAYER_WIDTH / 2;
              const playerCenterY = playerPos.y + PLAYER_HEIGHT / 2;
              const dx = cardCenterX - playerCenterX;
              const dy = cardCenterY - playerCenterY;
              const dist = Math.hypot(dx, dy);
              const maxDist = Math.hypot(containerSize.width, containerSize.height);
              // make threshold less sensitive: only when quite close
              const threshold = maxDist * 0.18; // ~18% of diagonal
              if (dist < threshold) {
                // nonlinear falloff so danger ramps up quickly when very close
                const raw = (threshold - dist) / threshold;
                danger = Math.max(0, Math.min(1, Math.pow(raw, 1.4)));
              } else {
                danger = 0;
              }
            }

            return (
              <ProductCard
                key={prod.id}
                position={positions[prod.id]}
                size={sizes[prod.id]}
                prod={prod}
                gameMode={gameMode}
                setCart={setCart}
                addToCart={addToCart}
                cardStyle={{ animationDelay: `${i * 60}ms`, "--danger": danger }}
              />
            );
          })
        )}
        {gameMode && (
          <Player playerPos={playerPos} setPlayerPos={setPlayerPos} />
        )}
      </div>

      <button
        onClick={() => {
          if (!gameMode) initializeGame();
          setGameMode(!gameMode);
        }}
        disabled={!backgroundImageLoaded}
      >
        {!backgroundImageLoaded ? "Loading background..." : gameMode ? "Product Mode" : "Game Mode"}
      </button>

      {gameOver && gameMode && <h2>GAME OVER</h2>}
    </div>
  );
};

export default GameField;
