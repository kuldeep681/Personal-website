import { useEffect, useRef, useState } from "react";
import { KERNEL_MENU } from "./data";

type Point = {
  x: number;
  y: number;
};

type BotState = "idle" | "blink";

type KernelAction = {
  index: string;
  label: string;
  href: string;
  external?: boolean;
};

const GRID = 16;
const DISPLAY_SIZE = 32;

const WHITE = "#F0F2F5";
const DARK = "#090A0C";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/kuldeep-mandal175514";

const REDDIT_URL = "https://www.reddit.com/";

const EMAIL_URL = "mailto:hello@kuldeepmandal.dev";

/*
 * ----------------------------------------------------------
 * KERNEL ACTIONS
 * ----------------------------------------------------------
 */

const KERNEL_ACTIONS: KernelAction[] = [
  ...KERNEL_MENU,
  {
    index: "08",
    label: "LinkedIn",
    href: LINKEDIN_URL,
    external: true,
  },
  {
    index: "09",
    label: "Reddit",
    href: REDDIT_URL,
    external: true,
  },
  {
    index: "10",
    label: "Email",
    href: EMAIL_URL,
    external: true,
  },
];

/*
 * ----------------------------------------------------------
 * RADIAL WHEEL
 * ----------------------------------------------------------
 *
 * Clean GTA-style radial navigation.
 *
 * Important design decisions:
 *
 * - One circular surface.
 * - Only radial separators.
 * - No concentric decorative rings.
 * - Transparent surface.
 * - Background remains visible.
 * - Background behind wheel is blurred.
 * - Kernel stays in the exact centre.
 */

function RadialKernelMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [active, setActive] = useState<number | null>(null);

  if (!open) {
    return null;
  }

  const items = KERNEL_ACTIONS;

  const SIZE = 400;
  const CENTER = SIZE / 2;

  /*
   * Outer and inner radius define the actual wheel.
   *
   * The inner radius leaves a clean centre for Kernel.
   */

  const OUTER_RADIUS = 184;
  const INNER_RADIUS = 64;

  const segmentAngle = 360 / items.length;

  const polar = (
    angle: number,
    radius: number,
  ): [number, number] => {
    const radians =
      ((angle - 90) * Math.PI) / 180;

    return [
      CENTER + Math.cos(radians) * radius,
      CENTER + Math.sin(radians) * radius,
    ];
  };

  /*
   * Creates one clean radial sector.
   *
   * There is a very small gap between sectors so the
   * wheel doesn't become visually heavy.
   */

  const createSectorPath = (
    index: number,
  ) => {
    const gap = 1.25;

    const startAngle =
      index * segmentAngle -
      segmentAngle / 2 +
      gap;

    const endAngle =
      index * segmentAngle +
      segmentAngle / 2 -
      gap;

    const [
      outerStartX,
      outerStartY,
    ] = polar(
      startAngle,
      OUTER_RADIUS,
    );

    const [
      outerEndX,
      outerEndY,
    ] = polar(
      endAngle,
      OUTER_RADIUS,
    );

    const [
      innerEndX,
      innerEndY,
    ] = polar(
      endAngle,
      INNER_RADIUS,
    );

    const [
      innerStartX,
      innerStartY,
    ] = polar(
      startAngle,
      INNER_RADIUS,
    );

    return [
      `M ${innerStartX} ${innerStartY}`,
      `L ${outerStartX} ${outerStartY}`,
      `A ${OUTER_RADIUS} ${OUTER_RADIUS} 0 0 1 ${outerEndX} ${outerEndY}`,
      `L ${innerEndX} ${innerEndY}`,
      `A ${INNER_RADIUS} ${INNER_RADIUS} 0 0 0 ${innerStartX} ${innerStartY}`,
      "Z",
    ].join(" ");
  };

  /*
   * Position labels around the middle of each sector.
   */

  const getLabelPosition = (
    index: number,
  ): [number, number] => {
    const angle =
      index * segmentAngle;

    return polar(
      angle,
      (OUTER_RADIUS + INNER_RADIUS) / 2,
    );
  };

  /*
   * Sector separator.
   *
   * Only ONE set of radial lines.
   * No extra rings.
   */

  const getSeparator = (
    index: number,
  ) => {
    const angle =
      index * segmentAngle -
      segmentAngle / 2;

    const [
      innerX,
      innerY,
    ] = polar(
      angle,
      INNER_RADIUS + 3,
    );

    const [
      outerX,
      outerY,
    ] = polar(
      angle,
      OUTER_RADIUS,
    );

    return {
      innerX,
      innerY,
      outerX,
      outerY,
    };
  };

  /*
   * Navigation.
   */

  const handleAction = (
    item: KernelAction,
  ) => {
    onClose();

    if (item.external) {
      window.open(
        item.href,
        "_blank",
        "noopener,noreferrer",
      );

      return;
    }

    if (item.href.startsWith("#")) {
      const id =
        item.href.slice(1);

      window.setTimeout(() => {
        document
          .getElementById(id)
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
      }, 60);

      return;
    }

    window.location.href =
      item.href;
  };

  return (
    <div
      data-kernel
      className="pointer-events-auto absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div
        className="
          relative
          h-[min(88vw,400px)]
          w-[min(88vw,400px)]
          animate-[kernel-wheel-in_420ms_cubic-bezier(0.16,1,0.3,1)]
        "
        onMouseLeave={() => {
          setActive(null);
        }}
      >
        {/* ------------------------------------------------ */}
        {/* Transparent blurred wheel surface               */}
        {/* ------------------------------------------------ */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-full
            border
            border-foreground/20
            bg-background/20
            backdrop-blur-md
          "
        />

        {/* ------------------------------------------------ */}
        {/* Radial navigation                               */}
        {/* ------------------------------------------------ */}

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="absolute inset-0 h-full w-full"
          role="menu"
          aria-label="Kernel navigation"
        >
          {/* ---------------------------------------------- */}
          {/* Clickable sectors                              */}
          {/* ---------------------------------------------- */}

          {items.map((item, index) => {
            const selected =
              active === index;

            const [
              labelX,
              labelY,
            ] = getLabelPosition(
              index,
            );

            return (
              <g key={item.label}>
                {/* Sector */}
                <path
                  d={createSectorPath(
                    index,
                  )}
                  fill={
                    selected
                      ? "color-mix(in oklab, var(--color-accent) 18%, transparent)"
                      : "transparent"
                  }
                  stroke="none"
                  className="cursor-pointer transition-[fill] duration-300"
                  onMouseEnter={() => {
                    setActive(index);
                  }}
                  onFocus={() => {
                    setActive(index);
                  }}
                  onClick={() => {
                    handleAction(item);
                  }}
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      event.preventDefault();
                      handleAction(
                        item,
                      );
                    }
                  }}
                  role="menuitem"
                  tabIndex={0}
                  aria-label={
                    item.label
                  }
                />

                {/* ---------------------------------------- */}
                {/* Single radial separator                  */}
                {/* ---------------------------------------- */}

                {(() => {
                  const separator =
                    getSeparator(
                      index,
                    );

                  return (
                    <line
                      x1={
                        separator.innerX
                      }
                      y1={
                        separator.innerY
                      }
                      x2={
                        separator.outerX
                      }
                      y2={
                        separator.outerY
                      }
                      stroke={
                        selected
                          ? "color-mix(in oklab, var(--color-accent) 70%, transparent)"
                          : "var(--color-border)"
                      }
                      strokeWidth={
                        selected
                          ? "1"
                          : "0.7"
                      }
                      opacity={
                        selected
                          ? "0.95"
                          : "0.75"
                      }
                      pointerEvents="none"
                    />
                  );
                })()}

                {/* ---------------------------------------- */}
                {/* Number                                   */}
                {/* ---------------------------------------- */}

                <text
                  x={labelX}
                  y={
                    labelY - 8
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  pointerEvents="none"
                  className="select-none font-mono text-[12px] font-medium"
                  fill="var(--color-accent)"
                >
                  {item.index}
                </text>

                {/* ---------------------------------------- */}
                {/* Label                                    */}
                {/* ---------------------------------------- */}

                <text
                  x={labelX}
                  y={
                    labelY + 10
                  }
                  textAnchor="middle"
                  dominantBaseline="middle"
                  pointerEvents="none"
                  className="select-none font-mono text-[8px] font-medium uppercase tracking-[0.12em]"
                  fill={
                    selected
                      ? "var(--color-foreground)"
                      : "var(--color-muted-foreground)"
                  }
                  opacity={
                    selected
                      ? 1
                      : 0.85
                  }
                >
                  {item.label}
                </text>

                {/* ---------------------------------------- */}
                {/* Tiny active marker                       */}
                {/* ---------------------------------------- */}

                {selected && (
                  <circle
                    cx={labelX}
                    cy={
                      labelY + 22
                    }
                    r="1.6"
                    fill="var(--color-accent)"
                    pointerEvents="none"
                  />
                )}
              </g>
            );
          })}

          {/* ------------------------------------------------ */}
          {/* Clean outer boundary                            */}
          {/* ------------------------------------------------ */}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={OUTER_RADIUS}
            fill="none"
            stroke="var(--color-foreground)"
            strokeWidth="0.8"
            opacity="0.2"
          />

          {/* ------------------------------------------------ */}
          {/* Clean centre boundary                           */}
          {/* ------------------------------------------------ */}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS}
            fill="var(--color-background)"
            fillOpacity="0.55"
            stroke="var(--color-foreground)"
            strokeWidth="0.8"
            strokeOpacity="0.25"
          />

          {/* ------------------------------------------------ */}
          {/* Small centre accent ring                       */}
          {/* ------------------------------------------------ */}

          <circle
            cx={CENTER}
            cy={CENTER}
            r={INNER_RADIUS - 7}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.6"
            strokeOpacity="0.45"
          />
        </svg>

        {/* ------------------------------------------------ */}
        {/* Kernel remains clearly visible in centre         */}
        {/* ------------------------------------------------ */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            flex
            h-[86px]
            w-[86px]
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
          "
        >
          <span
            className="
              absolute
              bottom-[8px]
              left-1/2
              -translate-x-1/2
              font-mono
              text-[7px]
              font-medium
              uppercase
              tracking-[0.18em]
              text-accent/70
            "
          >
            Kernel
          </span>
        </div>
      </div>
    </div>
  );
}

/*
 * ==========================================================
 * KERNEL
 * ==========================================================
 */

export function Kernel() {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const containerRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  /*
   * ----------------------------------------------------------
   * POSITION
   * ----------------------------------------------------------
   */

  const positionRef =
    useRef<Point>({
      x:
        typeof window !==
        "undefined"
          ? window.innerWidth -
            90
          : 0,

      y:
        typeof window !==
        "undefined"
          ? window.innerHeight -
            90
          : 0,
    });

  const destinationRef =
    useRef<Point>({
      x:
        typeof window !==
        "undefined"
          ? window.innerWidth -
            90
          : 0,

      y:
        typeof window !==
        "undefined"
          ? window.innerHeight -
            90
          : 0,
    });

  /*
   * ----------------------------------------------------------
   * CURSOR
   * ----------------------------------------------------------
   *
   * Cursor only controls eyes.
   */

  const cursorRef =
    useRef<Point>({
      x: 0,
      y: 0,
    });

  /*
   * ----------------------------------------------------------
   * WALKING
   * ----------------------------------------------------------
   */

  const walkingRef =
    useRef(false);

  const walkDistanceRef =
    useRef(0);

  /*
   * ----------------------------------------------------------
   * BOT STATE
   * ----------------------------------------------------------
   */

  const [botState, setBotState] =
    useState<BotState>("idle");

  const botStateRef =
    useRef<BotState>("idle");

  const blinkTimerRef =
    useRef<
      ReturnType<typeof setTimeout> | null
    >(null);

  /*
   * ----------------------------------------------------------
   * MENU
   * ----------------------------------------------------------
   */

  const [menuOpen, setMenuOpen] =
    useState(false);

  /*
   * ----------------------------------------------------------
   * REACTION
   * ----------------------------------------------------------
   */

  const [reaction, setReaction] =
    useState(false);

  const reactionTimerRef =
    useRef<number | null>(
      null,
    );

  /*
   * Synchronize bot state.
   */

  useEffect(() => {
    botStateRef.current =
      botState;
  }, [botState]);

  /*
   * ----------------------------------------------------------
   * CURSOR TRACKING
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handlePointerMove = (
      event: PointerEvent,
    ) => {
      cursorRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * PAGE CLICK → WALK
   * ----------------------------------------------------------
   *
   * Clicking outside Kernel:
   *
   * 1. Closes radial wheel.
   * 2. Sets Kernel destination.
   * 3. Makes Kernel walk there.
   *
   * Clicking inside [data-kernel] is ignored.
   */

  useEffect(() => {
    const handlePagePointerDown = (
      event: PointerEvent,
    ) => {
      const target =
        event.target;

      if (
        target instanceof Element &&
        target.closest(
          "[data-kernel]",
        )
      ) {
        return;
      }

      /*
       * Close radial wheel when
       * clicking anywhere outside it.
       */

      setMenuOpen(false);

      const padding = 35;

      const destinationX =
        Math.max(
          padding,
          Math.min(
            window.innerWidth -
              padding,
            event.clientX,
          ),
        );

      const destinationY =
        Math.max(
          padding,
          Math.min(
            window.innerHeight -
              padding,
            event.clientY,
          ),
        );

      destinationRef.current = {
        x: destinationX,
        y: destinationY,
      };

      walkDistanceRef.current =
        0;

      walkingRef.current =
        true;

      triggerReaction();
    };

    window.addEventListener(
      "pointerdown",
      handlePagePointerDown,
    );

    return () => {
      window.removeEventListener(
        "pointerdown",
        handlePagePointerDown,
      );
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * ESCAPE
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (
        event.key === "Escape"
      ) {
        setMenuOpen(false);
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * BLINKING
   * ----------------------------------------------------------
   */

  useEffect(() => {
    let cancelled = false;

    const scheduleBlink = (
      delay: number,
    ) => {
      blinkTimerRef.current =
        setTimeout(() => {
          if (cancelled) {
            return;
          }

          if (
            walkingRef.current
          ) {
            scheduleBlink(1200);
            return;
          }

          setBotState("blink");

          setTimeout(() => {
            if (cancelled) {
              return;
            }

            setBotState("idle");

            const nextDelay =
              1800 +
              Math.random() * 3200;

            scheduleBlink(
              nextDelay,
            );
          }, 110);
        }, delay);
    };

    scheduleBlink(
      2200 +
        Math.random() * 1800,
    );

    return () => {
      cancelled = true;

      if (
        blinkTimerRef.current
      ) {
        clearTimeout(
          blinkTimerRef.current,
        );
      }
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * WALKING LOOP
   * ----------------------------------------------------------
   */

  useEffect(() => {
    let frame = 0;

    const WALK_SPEED = 0.78;

    const animate = () => {
      const position =
        positionRef.current;

      const destination =
        destinationRef.current;

      const dx =
        destination.x -
        position.x;

      const dy =
        destination.y -
        position.y;

      const distance =
        Math.hypot(dx, dy);

      if (
        walkingRef.current &&
        distance > 1.5
      ) {
        const directionX =
          dx / distance;

        const directionY =
          dy / distance;

        const step = Math.min(
          WALK_SPEED,
          distance,
        );

        position.x +=
          directionX * step;

        position.y +=
          directionY * step;

        walkDistanceRef.current +=
          step;

        if (
          distance <=
          WALK_SPEED + 0.5
        ) {
          position.x =
            destination.x;

          position.y =
            destination.y;

          walkingRef.current =
            false;

          walkDistanceRef.current =
            0;
        }
      } else {
        walkingRef.current =
          false;
      }

      /*
       * Keep Kernel inside viewport.
       */

      const padding = 24;

      position.x = Math.max(
        padding,
        Math.min(
          window.innerWidth -
            padding,
          position.x,
        ),
      );

      position.y = Math.max(
        padding,
        Math.min(
          window.innerHeight -
            padding,
          position.y,
        ),
      );

      if (
        containerRef.current
      ) {
        containerRef.current.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`;
      }

      drawPixelCompanion();

      frame =
        requestAnimationFrame(
          animate,
        );
    };

    frame =
      requestAnimationFrame(
        animate,
      );

    return () => {
      cancelAnimationFrame(frame);
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * PIXEL COMPANION
   * ----------------------------------------------------------
   */

  function drawPixelCompanion() {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const ctx =
      canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    ctx.imageSmoothingEnabled =
      false;

    ctx.clearRect(
      0,
      0,
      GRID,
      GRID,
    );

    ctx.fillStyle = WHITE;

    /*
     * BODY / HEAD
     */

    ctx.fillRect(6, 1, 4, 1);
    ctx.fillRect(5, 2, 6, 1);
    ctx.fillRect(4, 3, 8, 1);
    ctx.fillRect(3, 4, 10, 1);
    ctx.fillRect(3, 5, 10, 5);
    ctx.fillRect(4, 10, 8, 1);
    ctx.fillRect(5, 11, 6, 1);

    /*
     * WALK FRAME
     */

    const walkFrame =
      Math.floor(
        walkDistanceRef.current /
          8,
      ) % 2;

    /*
     * ARMS
     */

    if (
      !walkingRef.current
    ) {
      ctx.fillRect(
        1,
        7,
        3,
        2,
      );

      ctx.fillRect(
        12,
        7,
        3,
        2,
      );
    } else if (
      walkFrame === 0
    ) {
      ctx.fillRect(
        1,
        6,
        3,
        2,
      );

      ctx.fillRect(
        12,
        8,
        3,
        2,
      );
    } else {
      ctx.fillRect(
        1,
        8,
        3,
        2,
      );

      ctx.fillRect(
        12,
        6,
        3,
        2,
      );
    }

    /*
     * EYES
     */

    const rect =
      canvas.getBoundingClientRect();

    const centerX =
      rect.left +
      rect.width / 2;

    const centerY =
      rect.top +
      rect.height / 2;

    const cursor =
      cursorRef.current;

    const dx =
      cursor.x - centerX;

    const dy =
      cursor.y - centerY;

    const distance =
      Math.hypot(dx, dy);

    const eyeDistance =
      Math.min(
        1,
        distance / 70,
      );

    const angle =
      Math.atan2(dy, dx);

    const eyeX =
      Math.round(
        Math.cos(angle) *
          eyeDistance,
      );

    const eyeY =
      Math.round(
        Math.sin(angle) *
          eyeDistance,
      );

    /*
     * BLINK
     */

    if (
      botStateRef.current !==
      "blink"
    ) {
      ctx.fillStyle = DARK;

      ctx.fillRect(
        6 + eyeX,
        6 + eyeY,
        1,
        2,
      );

      ctx.fillRect(
        9 + eyeX,
        6 + eyeY,
        1,
        2,
      );
    }

    /*
     * LEGS
     */

    ctx.fillStyle = WHITE;

    if (
      !walkingRef.current
    ) {
      ctx.fillRect(
        4,
        12,
        2,
        3,
      );

      ctx.fillRect(
        3,
        14,
        3,
        1,
      );

      ctx.fillRect(
        10,
        12,
        2,
        3,
      );

      ctx.fillRect(
        10,
        14,
        3,
        1,
      );
    } else if (
      walkFrame === 0
    ) {
      ctx.fillRect(
        3,
        12,
        2,
        3,
      );

      ctx.fillRect(
        2,
        14,
        3,
        1,
      );

      ctx.fillRect(
        10,
        12,
        2,
        2,
      );

      ctx.fillRect(
        10,
        14,
        3,
        1,
      );
    } else {
      ctx.fillRect(
        5,
        12,
        2,
        2,
      );

      ctx.fillRect(
        4,
        14,
        3,
        1,
      );

      ctx.fillRect(
        11,
        12,
        2,
        3,
      );

      ctx.fillRect(
        11,
        14,
        3,
        1,
      );
    }
  }

  /*
   * ----------------------------------------------------------
   * CLICK REACTION
   * ----------------------------------------------------------
   */

  function triggerReaction() {
    setReaction(true);

    if (
      reactionTimerRef.current !==
      null
    ) {
      window.clearTimeout(
        reactionTimerRef.current,
      );
    }

    reactionTimerRef.current =
      window.setTimeout(() => {
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
      if (
        reactionTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          reactionTimerRef.current,
        );
      }
    };
  }, []);

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
        transform:
          "translate3d(-90px, -90px, 0)",
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {/* Radial navigation wheel */}

        <RadialKernelMenu
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);
          }}
        />

        {/* Kernel */}

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

            setMenuOpen(
              (current) => !current,
            );
          }}
          className="
            pointer-events-auto
            relative
            z-10
            flex
            h-10
            w-10
            items-center
            justify-center
            border-0
            bg-transparent
            p-0
            focus:outline-none
            focus-visible:ring-1
            focus-visible:ring-accent
          "
        >
          <canvas
            ref={canvasRef}
            width={GRID}
            height={GRID}
            className="h-8 w-8"
            style={{
              width: `${DISPLAY_SIZE}px`,
              height: `${DISPLAY_SIZE}px`,
              imageRendering:
                "pixelated",

              animation: reaction
                ? "kernel-hop 220ms steps(3, end)"
                : "none",
            }}
          />
        </button>
      </div>
    </div>
  );
}

export default Kernel;