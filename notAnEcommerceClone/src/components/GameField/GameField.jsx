import ProductCard from "../ProductCard/ProductCard";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectIsAdmin } from "../../store/slices/userSlice";
import { addToCart as addToCartAction } from "../../store/slices/cartSlice";
import { mulberry32, remap } from "../../utils/mathUtils.js";
import Player from "../Player/Player.jsx";
import "./GameField.css";
import ControlPanel from "../ControlPanel/ControlPanel.jsx";
import SortControls from "../SortControls/SortControls.jsx";
import AdminBackgroundPanel from "../AdminBackgroundPanel/AdminBackgroundPanel.jsx";
import PriceFilter from "../PriceFilter/PriceFilter.jsx";
import { Form } from "react-bootstrap";
import { useLocation } from "react-router";

const getPlayerWidth = () => (window.innerWidth <= 768 ? 30 : 50);
const getPlayerHeight = () => (window.innerWidth <= 768 ? 6 : 10);

const GameField = () => {
  /*
   * This component renders the game field where products are displayed as cards.
   * It includes player controls, score tracking, and game settings.
   * The page can be viewed in two modes: product browsing and game mode.
   * product browsing mode allows users to filter and sort products,
   * while game mode turns the page into an interactive game.
   * in game mode, products fall from the top of the screen,
   * and the player must avoid colliding with them.

   * @returns {JSX.Element} The game field component.
   */

  // Redux selectors and dispatch
  const isAdmin = useSelector(selectIsAdmin);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  const location = useLocation();
  const [filterPrice, setFilterPrice] = useState([795, 100000]);
  const [gameMode, setGameMode] = useState(false);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });
  const [positions, setPositions] = useState({});
  const [sizes, setSizes] = useState({});
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [speed, setSpeed] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [backgroundImageLoaded, setBackgroundImageLoaded] = useState(false);
  const [sortBy, setSortBy] = useState("default");
  const [adminBgPalette, setAdminBgPalette] = useState("vibrant");
  const [adminBgOpacity, setAdminBgOpacity] = useState(0.7);

  // Only allow speed to be used if user is admin
  const actualSpeed = isAdmin ? speed : 1;

  // Refs for mutable values used in game loop
  // we need these to avoid stale closures in requestAnimationFrame
  // this means we don't have to add these to effect dependencies and
  // cause unwanted re-renders

  const containerRef = useRef(null);
  const positionsRef = useRef({});
  const sizesRef = useRef({});
  const playerPosRef = useRef(playerPos);
  const speedRef = useRef(actualSpeed);
  const gameOverRef = useRef(gameOver);
  const isPausedRef = useRef(isPaused);
  const manualPauseRef = useRef(false);

  // Create a safe setSpeed that only allows admins to change speed
  const safeSetSpeed = useCallback(
    (newSpeed) => {
      if (isAdmin) {
        setSpeed(newSpeed);
      }
    },
    [isAdmin]
  );

  // Memoized addToCart to avoid re-renders
  const addToCart = useCallback(
    (product) => {
      dispatch(addToCartAction(product));
    },
    [dispatch]
  );

  // Filter products based on price range, useMemo is used to introduce memoization
  // and avoid unnecessary recalculations on re-renders
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

  // Reset game mode when component mounts or location changes
  useEffect(() => {
    setGameMode(false);
  }, [location.pathname]);

  // Sync refs inline to avoid extra effect runs
  positionsRef.current = positions;
  sizesRef.current = sizes;
  playerPosRef.current = playerPos;
  speedRef.current = actualSpeed;
  gameOverRef.current = gameOver;
  isPausedRef.current = isPaused;

  // Reset speed to 1 when admin logs out during game
  useEffect(() => {
    if (!isAdmin && gameMode && speed !== 1) {
      setSpeed(1);
    }
  }, [isAdmin, gameMode, speed]);

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

  // useEffect(() => {
  //   // kept intentionally empty - resize handler is declared at top-level now
  // }, []);

  // Disable body scrolling when in game mode
  useEffect(() => {
    if (gameMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [gameMode]);

  // Handle Escape key to toggle pause in game mode
  useEffect(() => {
    if (!gameMode || gameOver) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsPaused((prev) => {
          const newPaused = !prev;
          manualPauseRef.current = newPaused;
          return newPaused;
        });
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [gameMode, gameOver]);

  // updateContainerSize is used in multiple places (initial measurement,
  // on resize, and when switching modes) so keep it at component scope.
  // useCallback is used to memoize the function similar to useMemo for values.
  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerSize({
        width: rect.width,
        height: rect.height,
      });
    }
  }, []);

  // Initial container size measurement and on window resize. 
  // It works by attaching a resize event listener to the window so when
  // the window is resized, the container size is recalculated.
  // I tried using ResizeObserver but it caused too many re-renders.
  // Another thing that I tried was to counterscale the container with CSS in gamemode, but it was 
  // causing issues with position calculations.

  // Ideally, no resize should be necessary during gameplay, as it can disrupt the experience, but I couldn't find
  // a better solution that worked reliably across different scenarios, including mobile devices.
  useEffect(() => {
    updateContainerSize();
    window.addEventListener("resize", updateContainerSize);
    return () => window.removeEventListener("resize", updateContainerSize);
  }, []);

  // Recompute container size when switching between product/game mode so
  // positioning uses the correct available area.
  useEffect(() => {
    // allow layout to settle
    const t = setTimeout(() => updateContainerSize(), 0);
    return () => clearTimeout(t);
  }, [gameMode, filteredProducts.length]);


  // set player start position based on container size (at the bottom center)
  useEffect(() => {
    if (containerSize.width === 0 || containerSize.height === 0) return;

    setPlayerPos({
      x: containerSize.width / 2 - getPlayerWidth() / 2,
      y: containerSize.height - getPlayerHeight() - 5,
    });
  }, [containerSize]);

  // Calculate card size based on price
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
      // Only update if the product doesn't already have a size
      if (prev[id]) return prev;
      const next = { ...prev, [id]: size };
      sizesRef.current = next;
      return next;
    });
  };

  // Ensure all filtered products have sizes calculated
  const updateCardSizes = useCallback(() => {
    filteredProducts.forEach((prod) => {
      // Only calculate size if it doesn't exist
      if (!sizesRef.current[prod.id]) {
        updateSize(prod.id, getCardSize(prod.price));
      }
    });
  }, [filteredProducts]);

  // Initial size calculation, and whenever filtered products change. In the array of dependencies, i put updateCardSizes 
  // because it is memoized with useCallback, so it will only change if filteredProducts change.
  useEffect(() => {
    updateCardSizes();
  }, [updateCardSizes]);

  // This uses a simple PRNG (Pseudo‑Random Number Generator) 
  // based on product ID to ensure consistent random positions
  // I used mulberry32 because it is simple and fast for this use case
  // Here is the repo I got it from: https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
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

  // Collision detection between two rectangles using the AABB method (Axis-Aligned Bounding Box)
  // Found some reference here https://tutorialedge.net/gamedev/aabb-collision-detection-tutorial/
  const isColliding = (posA, sizeA, posB, sizeB) => {
    if (!posA || !posB || !sizeA || !sizeB) return false;
    return !(
      posA.x + sizeA.width < posB.x ||
      posA.x > posB.x + sizeB.width ||
      posA.y + sizeA.height < posB.y ||
      posA.y > posB.y + sizeB.height
    );
  };

  // Resolve collisions by adjusting positions iteratively. Iterations means that it may not succeed 100%, but
  // it should be good enough for this use case without causing too much performance overhead.

  // What it does is it loops through all pairs of products and checks if they are colliding. 
  // If they are, it adjusts their positions slightly apart from each other.
  // This process is repeated until no collisions are detected or a maximum number of iterations is reached.

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

  // Initialize game by generating random starting positions for all products and then resolving collisions
  // It also resets score, game over state, and start time.
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
    setGameStartTime(Date.now());
  };

  // Move all products down based on speed, and reset position if they go off screen
  // When off screen, increase score and respawn at top with new random position, after that it resolves collisions again.
  // Finally, check for collisions with player.
  const moveAll = () => {
    const currentPositions = { ...positionsRef.current };
    const currentSizes = sizesRef.current;
    const currentSpeed = speedRef.current;

    // Calculate progressive speed: increases by 50% every 10 seconds
    const elapsedSeconds = gameStartTime
      ? (Date.now() - gameStartTime) / 1000
      : 0;
    const progressiveMultiplier = 1 + (elapsedSeconds / 10) * 0.5;
    const finalSpeed = currentSpeed * progressiveMultiplier;

    filteredProducts.forEach((prod) => {
      const currentPos = currentPositions[prod.id];
      const size = currentSizes[prod.id];
      if (!currentPos || !size) return;

      const newPos = {
        x: currentPos.x,
        y: currentPos.y + 1 * finalSpeed,
      };

      currentPositions[prod.id] = newPos;
    });

    positionsRef.current = currentPositions;
    setPositions(currentPositions);
  };

  // Main game loop using requestAnimationFrame
  // It moves products, checks for off-screen respawns, and detects collisions with the player.
  // If a collision is detected, the game ends.
  // The loop respects the paused state and game over state.
  // It still leaver full control over the other components of the page.
  // When hovering over a product card, the game pauses and resumes when the mouse leaves.
  // Pressing Escape also toggles pause.
  // Products can be clicked to add to cart without affecting the game state or to visit product page.
  useEffect(() => {
    if (!gameMode) return;

    let animationFrameId;

    const loop = () => {
      if (gameOverRef.current || isPausedRef.current) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      moveAll();

      const currentPositions = positionsRef.current;
      const currentSizes = sizesRef.current;
      const currentPlayerPos = playerPosRef.current;

      const playerHitboxPos = {
        x: currentPlayerPos.x,
        y: currentPlayerPos.y,
      };
      const playerHitboxSize = {
        width: getPlayerWidth(),
        height: getPlayerHeight(),
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

      // Check for collisions with player
      if (collisionThisFrame) {
        setGameOver(true);
        gameOverRef.current = true;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    // Start the loop
    animationFrameId = requestAnimationFrame(loop);
    // Cleanup on unmount or when gameMode changes
    return () => cancelAnimationFrame(animationFrameId);
  }, [gameMode, filterPrice, containerSize]);

  // Initialize game when entering game mode and we have sizes calculated
  useEffect(() => {
    if (
      gameMode &&
      Object.keys(sizes).length > 0 &&
      Object.keys(positions).length === 0
    ) {
      // Only initialize if we don't have positions yet
      initializeGame();
    }
  }, [gameMode, sizes, containerSize, products]);

  return (
    <div className={gameMode ? "no-scroll game-mode-layout" : ""}>
      {!gameMode && (
        <div
          ref={containerRef}
          id="game-field"
          style={{ "--game-bg": backgroundImage }}
          className="product-display"
        >
          <div className="product-controls">
            {/* this section contains filters and sorting controls */}
            <PriceFilter
              filterPrice={filterPrice}
              setFilterPrice={setFilterPrice}
            />
            <SortControls sortBy={sortBy} setSortBy={setSortBy} />
          </div>

          {loading
            ? // show skeletons while loading
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="product-card skeleton" />
              ))
            : filteredProducts.map((prod, i) => {
                return (
                  <ProductCard
                    key={prod.id}
                    prod={prod}
                    gameMode={false}
                    addToCart={addToCart}
                    cardStyle={{ animationDelay: `${i * 60}ms` }}
                  />
                );
              })}
        </div>
      )}

      {/* if game mode is active, then it shows the game display and the control panel */}
      {gameMode && (
        <div
          ref={containerRef}
          id="game-field"
          style={{ "--game-bg": backgroundImage }}
          className="game-display"
        >
          <ControlPanel
            score={score}
            speed={speed}
            setSpeed={safeSetSpeed}
            gameOver={gameOver}
            filterPrice={filterPrice}
            setFilterPrice={setFilterPrice}
          />

          {isAdmin && window.innerWidth > 768 && (
            <AdminBackgroundPanel
              palette={adminBgPalette}
              setPalette={setAdminBgPalette}
              opacity={adminBgOpacity}
              setOpacity={setAdminBgOpacity}
            />
          )}

          {filteredProducts.map((prod, i) => {
            const pos = positions[prod.id];
            const size = sizes[prod.id];
            let danger = 0;
            if (
              gameMode &&
              pos &&
              size &&
              containerSize.width &&
              containerSize.height
            ) {
              const cardCenterX = pos.x + (size.width || 0) / 2;
              const cardCenterY = pos.y + (size.height || 0) / 2;
              const playerCenterX = playerPos.x + getPlayerWidth() / 2;
              const playerCenterY = playerPos.y + getPlayerHeight() / 2;
              const dx = cardCenterX - playerCenterX;
              const dy = cardCenterY - playerCenterY;
              const dist = Math.hypot(dx, dy);
              const maxDist = Math.hypot(
                containerSize.width,
                containerSize.height
              );
              // make threshold less sensitive: only when quite close
              const threshold = maxDist * 0.18; // ~18% of diagonal
              if (dist < threshold) {
                // nonlinear falloff so danger ramps up quickly when very close
                const raw = (threshold - dist) / threshold;
                // I thought it was nice to make the cards red when very close
                danger = Math.max(0, Math.min(1, Math.pow(raw, 1.4)));
              } else {
                danger = 0;
              }
            }

            return (
              // Render ProductCard in game mode with position, size, and danger level
              <ProductCard
                key={prod.id}
                position={positions[prod.id]}
                size={sizes[prod.id]}
                prod={prod}
                gameMode={gameMode}
                addToCart={addToCart}
                setIsPaused={setIsPaused}
                manualPauseRef={manualPauseRef}
                cardStyle={{
                  animationDelay: `${i * 60}ms`,
                  "--danger": danger,
                }}
              />
            );
          })}

          {/* Player component represents the player in the game */}
          <Player
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            isPaused={isPaused}
            gameOver={gameOver}
          />

          {/* button to toggle between game mode and product mode */}
          <button
            className="game-mode-toggle-btn"
            onClick={() => {
              if (!gameMode) initializeGame();
              setGameMode(!gameMode);
            }}
            disabled={!backgroundImageLoaded}
          >
            {!backgroundImageLoaded ? "Loading..." : "Product Mode"}
          </button>
        </div>
      )}

      <button
        className="game-mode-toggle-btn"
        onClick={() => {
          if (!gameMode) initializeGame();
          setGameMode(!gameMode);
        }}
        disabled={!backgroundImageLoaded}
        style={{ display: gameMode ? "none" : "block" }}
      >
        {!backgroundImageLoaded ? "Loading..." : "Game Mode"}
      </button>

      {gameOver && gameMode && (
        <div className="game-over-overlay">
          <h2>GAME OVER</h2>
          <p>Final Score: {score}</p>
          <button
            className="play-again-btn"
            onClick={() => {
              setGameOver(false);
              gameOverRef.current = false;
              setScore(0);
              setGameStartTime(null);
              setSpeed(1);
              initializeGame();
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {isPaused && gameMode && !gameOver && (
        <div className="pause-overlay">
          <h2>PAUSED</h2>
          <p>Press ESC to resume</p>
        </div>
      )}
    </div>
  );
};

export default GameField;
