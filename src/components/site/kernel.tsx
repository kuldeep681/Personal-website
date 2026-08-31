import { useEffect, useRef, useState } from "react";
import { KERNEL_MENU } from "./data";

type Point = {
  x: number;
  y: number;
};

type BotState = "idle" | "blink";

const GRID = 16;
const DISPLAY_SIZE = 32;

const WHITE = "#F0F2F5";
const DARK = "#090A0C";

export function Kernel() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  /*
   * ----------------------------------------------------------
   * POSITION
   * ----------------------------------------------------------
   *
   * Kernel moves ONLY toward clicks.
   * Mouse movement never moves the body.
   */

  const positionRef = useRef<Point>({
    x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,

    y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
  });

  const destinationRef = useRef<Point>({
    x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,

    y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
  });

  /*
   * ----------------------------------------------------------
   * CURSOR
   * ----------------------------------------------------------
   *
   * Used ONLY for eye direction.
   */

  const cursorRef = useRef<Point>({
    x: 0,
    y: 0,
  });

  /*
   * ----------------------------------------------------------
   * WALKING
   * ----------------------------------------------------------
   */

  const walkingRef = useRef(false);
  const walkDistanceRef = useRef(0);

  /*
   * ----------------------------------------------------------
   * BOT ANIMATION
   * ----------------------------------------------------------
   */

  const [botState, setBotState] = useState<BotState>("idle");

  const botStateRef = useRef<BotState>("idle");

  const blinkTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /*
   * ----------------------------------------------------------
   * MENU
   * ----------------------------------------------------------
   */

  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * ----------------------------------------------------------
   * CLICK REACTION
   * ----------------------------------------------------------
   */

  const [reaction, setReaction] = useState(false);

  const reactionTimerRef = useRef<number | null>(null);

  /*
   * Keep animation ref synchronized.
   */

  useEffect(() => {
    botStateRef.current = botState;
  }, [botState]);

  /*
   * ----------------------------------------------------------
   * CURSOR TRACKING
   * ----------------------------------------------------------
   *
   * IMPORTANT:
   *
   * This does NOT change Kernel's position.
   */

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      cursorRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener("pointermove", handlePointerMove, {
      passive: true,
    });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * PAGE CLICK → DESTINATION
   * ----------------------------------------------------------
   *
   * Any click on the page becomes a destination.
   *
   * Clicking Kernel itself is excluded.
   */

  useEffect(() => {
    const handlePagePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (target instanceof Element && target.closest("[data-kernel]")) {
        return;
      }

      const padding = 35;

      const destinationX = Math.max(padding, Math.min(window.innerWidth - padding, event.clientX));

      const destinationY = Math.max(padding, Math.min(window.innerHeight - padding, event.clientY));

      destinationRef.current = {
        x: destinationX,
        y: destinationY,
      };

      walkDistanceRef.current = 0;

      walkingRef.current = true;

      triggerReaction();
    };

    window.addEventListener("pointerdown", handlePagePointerDown);

    return () => {
      window.removeEventListener("pointerdown", handlePagePointerDown);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * ESCAPE
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * BLINKING
   * ----------------------------------------------------------
   *
   * Natural occasional blink.
   */

  useEffect(() => {
    let cancelled = false;

    const scheduleBlink = (delay: number) => {
      blinkTimerRef.current = setTimeout(() => {
        if (cancelled) return;

        /*
         * Don't blink while walking.
         */
        if (walkingRef.current) {
          scheduleBlink(1200);
          return;
        }

        setBotState("blink");

        setTimeout(() => {
          if (cancelled) return;

          setBotState("idle");

          const nextDelay = 1800 + Math.random() * 3200;

          scheduleBlink(nextDelay);
        }, 110);
      }, delay);
    };

    scheduleBlink(2200 + Math.random() * 1800);

    return () => {
      cancelled = true;

      if (blinkTimerRef.current) {
        clearTimeout(blinkTimerRef.current);
      }
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * MAIN WALKING LOOP
   * ----------------------------------------------------------
   */

  useEffect(() => {
    let frame = 0;

    /*
     * Slow walking speed.
     */
    const WALK_SPEED = 0.78;

    const animate = () => {
      const position = positionRef.current;

      const destination = destinationRef.current;

      const dx = destination.x - position.x;

      const dy = destination.y - position.y;

      const distance = Math.hypot(dx, dy);

      if (walkingRef.current && distance > 1.5) {
        const directionX = dx / distance;

        const directionY = dy / distance;

        const step = Math.min(WALK_SPEED, distance);

        position.x += directionX * step;

        position.y += directionY * step;

        walkDistanceRef.current += step;

        if (distance <= WALK_SPEED + 0.5) {
          position.x = destination.x;

          position.y = destination.y;

          walkingRef.current = false;

          walkDistanceRef.current = 0;
        }
      } else {
        walkingRef.current = false;
      }

      /*
       * Keep Kernel inside viewport.
       */
      const padding = 24;

      position.x = Math.max(padding, Math.min(window.innerWidth - padding, position.x));

      position.y = Math.max(padding, Math.min(window.innerHeight - padding, position.y));

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
      }

      drawPixelCompanion();

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * PIXEL COMPANION
   * ----------------------------------------------------------
   *
   * LOCKED SILHOUETTE.
   *
   * Only subtle proportional changes:
   *
   * - slightly larger round body
   * - horizontally longer hands
   * - thicker legs
   */

  function drawPixelCompanion() {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    ctx.clearRect(0, 0, GRID, GRID);

    ctx.fillStyle = WHITE;

    /*
     * --------------------------------------------------------
     * BODY / HEAD
     * --------------------------------------------------------
     *
     * Slightly larger than the previous
     * silhouette while keeping the same
     * rounded pixel character.
     *
     * Previous main body:
     *
     *   x=4 width=8
     *
     * New:
     *
     *   x=3 width=10
     */

    // Strictly rounded body — slightly larger
    ctx.fillRect(6, 1, 4, 1);
    ctx.fillRect(5, 2, 6, 1);
    ctx.fillRect(4, 3, 8, 1);
    ctx.fillRect(3, 4, 10, 1);
    ctx.fillRect(3, 5, 10, 5);
    ctx.fillRect(4, 10, 8, 1);
    ctx.fillRect(5, 11, 6, 1);

    /*
     * --------------------------------------------------------
     * WALK FRAME
     * --------------------------------------------------------
     *
     * Slower frame switching.
     */

    const walkFrame = Math.floor(walkDistanceRef.current / 8) % 2;

    /*
     * --------------------------------------------------------
     * ARMS / HANDS
     * --------------------------------------------------------
     *
     * IMPORTANT:
     *
     * Hands are now longer HORIZONTALLY.
     *
     * They are NOT made dramatically longer.
     */

    if (!walkingRef.current) {
      /*
       * Left hand:
       *
       * x=1 → x=3
       */
      ctx.fillRect(1, 7, 3, 2);

      /*
       * Right hand:
       *
       * x=12 → x=14
       */
      ctx.fillRect(12, 7, 3, 2);
    } else if (walkFrame === 0) {
      /*
       * Walking arm A.
       */
      ctx.fillRect(1, 6, 3, 2);

      ctx.fillRect(12, 8, 3, 2);
    } else {
      /*
       * Walking arm B.
       */
      ctx.fillRect(1, 8, 3, 2);

      ctx.fillRect(12, 6, 3, 2);
    }

    /*
     * --------------------------------------------------------
     * EYES
     * --------------------------------------------------------
     *
     * Eyes still follow the cursor.
     *
     * Maximum movement = 1 pixel.
     */

    const rect = canvas.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;

    const centerY = rect.top + rect.height / 2;

    const cursor = cursorRef.current;

    const dx = cursor.x - centerX;

    const dy = cursor.y - centerY;

    const distance = Math.hypot(dx, dy);

    const eyeDistance = Math.min(1, distance / 70);

    const angle = Math.atan2(dy, dx);

    const eyeX = Math.round(Math.cos(angle) * eyeDistance);

    const eyeY = Math.round(Math.sin(angle) * eyeDistance);

    /*
     * --------------------------------------------------------
     * BLINK
     * --------------------------------------------------------
     */

    if (botStateRef.current !== "blink") {
      ctx.fillStyle = DARK;

      /*
       * Left eye.
       */
      ctx.fillRect(6 + eyeX, 6 + eyeY, 1, 2);

      /*
       * Right eye.
       */
      ctx.fillRect(9 + eyeX, 6 + eyeY, 1, 2);
    }

    /*
     * --------------------------------------------------------
     * LEGS
     * --------------------------------------------------------
     *
     * Slightly THICKER.
     *
     * We use width=2 instead of width=1.
     *
     * This makes them look less fragile
     * without changing the character.
     */

    ctx.fillStyle = WHITE;

    if (!walkingRef.current) {
      /*
       * LEFT LEG
       */
      ctx.fillRect(4, 12, 2, 3);

      /*
       * LEFT FOOT
       */
      ctx.fillRect(3, 14, 3, 1);

      /*
       * RIGHT LEG
       */
      ctx.fillRect(10, 12, 2, 3);

      /*
       * RIGHT FOOT
       */
      ctx.fillRect(10, 14, 3, 1);
    } else if (walkFrame === 0) {
      /*
       * WALKING STEP A
       *
       * LEFT
       */
      ctx.fillRect(3, 12, 2, 3);

      ctx.fillRect(2, 14, 3, 1);

      /*
       * RIGHT
       */
      ctx.fillRect(10, 12, 2, 2);

      ctx.fillRect(10, 14, 3, 1);
    } else {
      /*
       * WALKING STEP B
       *
       * LEFT
       */
      ctx.fillRect(5, 12, 2, 2);

      ctx.fillRect(4, 14, 3, 1);

      /*
       * RIGHT
       */
      ctx.fillRect(11, 12, 2, 3);

      ctx.fillRect(11, 14, 3, 1);
    }
  }

  /*
   * ----------------------------------------------------------
   * CLICK REACTION
   * ----------------------------------------------------------
   */

  function triggerReaction() {
    setReaction(true);

    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
    }

    reactionTimerRef.current = window.setTimeout(() => {
      setReaction(false);
    }, 220);
  }

  /*
   * ----------------------------------------------------------
   * REACTION CLEANUP
   * ----------------------------------------------------------
   */

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current !== null) {
        window.clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * MENU
   * ----------------------------------------------------------
   */

  const menu = menuOpen ? (
    <div
      data-kernel
      className="absolute bottom-full right-0 mb-3 w-52 border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-md"
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
    >
      <div className="mb-1 border-b border-border px-2 pb-2">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
          Kernel
        </span>
      </div>

      <nav className="flex flex-col">
        {KERNEL_MENU.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target={item.external ? "_blank" : undefined}
            rel={item.external ? "noreferrer" : undefined}
            onClick={() => {
              setMenuOpen(false);
            }}
            className="flex items-center gap-2 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <span className="w-5 text-accent/70">{item.index}</span>

            <span>{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  ) : null;

  /*
   * ----------------------------------------------------------
   * RENDER
   * ----------------------------------------------------------
   */

  return (
    <div
      ref={containerRef}
      data-kernel
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{
        transform: "translate3d(-90px, -90px, 0)",
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {menu}

        <button
          type="button"
          data-kernel
          aria-label="Open Kernel navigation"
          aria-expanded={menuOpen}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={(event) => {
            event.stopPropagation();

            triggerReaction();

            setMenuOpen((current) => !current);
          }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center border-0 bg-transparent p-0 focus:outline-none"
        >
          <canvas
            ref={canvasRef}
            width={GRID}
            height={GRID}
            className="h-8 w-8"
            style={{
              width: `${DISPLAY_SIZE}px`,
              height: `${DISPLAY_SIZE}px`,
              imageRendering: "pixelated",

              animation: reaction ? "kernel-hop 220ms steps(3, end)" : "none",
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default Kernel;
