import {
  useEffect,
  useRef,
  useState,
} from "react";
import { GITHUB_URL } from "./data";

type Point = {
  x: number;
  y: number;
};

type BotState = "idle" | "blink";

type KernelAction = {
  label: string;
  href?: string;
  external?: boolean;
};

const GRID = 16;
const DISPLAY_SIZE = 32;

const WHITE = "#F0F2F5";
const DARK = "#090A0C";

const LINKEDIN_URL =
  "https://www.linkedin.com/in/kuldeep-mandal175514";

const REDDIT_URL =
  "https://www.reddit.com/u/Inevitable-Bear-/s/fjEtp9s7Wd";

/*
 * ==========================================================
 * KERNEL ACTIONS
 * ==========================================================
 */

const KERNEL_ACTIONS: KernelAction[] = [
  {
    label: "GitHub",
    href: GITHUB_URL,
    external: true,
  },
  {
    label: "LinkedIn",
    href: LINKEDIN_URL,
    external: true,
  },
  {
    label: "Reddit",
    href: REDDIT_URL,
    external: true,
  },
  {
    label: "View CV",
  },
];

/*
 * ==========================================================
 * KERNEL MENU
 * ==========================================================
 */

function KernelMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) {
    return null;
  }

  const handleAction = (
    item: KernelAction,
  ) => {
    if (!item.href) {
      return;
    }

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
      className="
        pointer-events-auto
        absolute
        bottom-full
        left-1/2
        z-20
        mb-3
        w-[190px]
        -translate-x-1/2
        animate-[kernel-menu-in_220ms_cubic-bezier(0.16,1,0.3,1)]
      "
      onPointerDown={(event) => {
        event.stopPropagation();
      }}
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <div
        className="
          overflow-hidden
          border
          border-border
          bg-background
          shadow-[0_12px_35px_rgba(0,0,0,0.35)]
        "
      >
        {KERNEL_ACTIONS.map(
          (item, index) => {
            const disabled =
              !item.href;

            return (
              <button
                key={item.label}
                type="button"
                disabled={disabled}
                onClick={() => {
                  handleAction(item);
                }}
                className={`
                  group
                  flex
                  w-full
                  items-center
                  justify-between
                  border-b
                  border-border
                  px-4
                  py-3
                  text-left
                  last:border-b-0
                  ${
                    disabled
                      ? "cursor-default opacity-50"
                      : "cursor-pointer hover:bg-foreground/[0.035]"
                  }
                `}
              >
                <span className="flex items-center gap-3">
                  <span
                    className="
                      font-mono
                      text-[10px]
                      font-medium
                      tracking-[0.12em]
                      text-accent
                    "
                  >
                    {String(
                      index + 1,
                    ).padStart(2, "0")}
                  </span>

                  <span
                    className="
                      font-mono
                      text-[11px]
                      font-medium
                      uppercase
                      tracking-[0.12em]
                      text-foreground
                    "
                  >
                    {item.label}
                  </span>
                </span>

                {!disabled && (
                  <span
                    className="
                      font-mono
                      text-[11px]
                      text-muted-foreground
                      transition-transform
                      duration-200
                      group-hover:translate-x-0.5
                      group-hover:text-accent
                    "
                  >
                    ↗
                  </span>
                )}

                {disabled && (
                  <span
                    className="
                      font-mono
                      text-[9px]
                      uppercase
                      tracking-[0.1em]
                      text-muted-foreground
                    "
                  >
                    Soon
                  </span>
                )}
              </button>
            );
          },
        )}
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
   * HOME POSITION
   * ----------------------------------------------------------
   */

  const getHomePosition =
    (): Point => {
      if (
        typeof window ===
        "undefined"
      ) {
        return {
          x: 32,
          y: 32,
        };
      }

      const homeLink =
        document.querySelector<HTMLAnchorElement>(
          'a[href="#top"]',
        );

      if (homeLink) {
        const rect =
          homeLink.getBoundingClientRect();

        return {
          x:
            rect.right + 27,
          y:
            rect.top +
            rect.height / 2,
        };
      }

      /*
       * Safe fallback if the navbar link
       * cannot be found.
       */

      return {
        x: 90,
        y: 32,
      };
    };

  const initialHome =
    typeof window !==
    "undefined"
      ? getHomePosition()
      : {
          x: 32,
          y: 32,
        };

  const positionRef =
    useRef<Point>(
      initialHome,
    );

  const destinationRef =
    useRef<Point>(
      initialHome,
    );

  const homePositionRef =
    useRef<Point>(
      initialHome,
    );

  /*
   * ----------------------------------------------------------
   * CURSOR
   * ----------------------------------------------------------
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
   * RETURNING HOME
   * ----------------------------------------------------------
   *
   * This is the important state that makes the
   * 10-second return behavior reliable.
   */

  const returningHomeRef =
    useRef(false);

  /*
   * ----------------------------------------------------------
   * SLEEPING
   * ----------------------------------------------------------
   */

  const [sleeping, setSleeping] =
    useState(true);

  const sleepingRef =
    useRef(true);

  /*
   * ----------------------------------------------------------
   * RETURN TIMER
   * ----------------------------------------------------------
   *
   * Browser timers use number.
   */

  const homeTimerRef =
    useRef<number | null>(
      null,
    );

  /*
   * ----------------------------------------------------------
   * BOT STATE
   * ----------------------------------------------------------
   */

  const [botState, setBotState] =
    useState<BotState>("idle");

  const botStateRef =
    useRef<BotState>("idle");

  /*
   * Keep the ref synchronized with React state.
   */

  useEffect(() => {
    botStateRef.current =
      botState;
  }, [botState]);

  const blinkTimerRef =
    useRef<number | null>(
      null,
    );

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
   * ----------------------------------------------------------
   * STATE HELPERS
   * ----------------------------------------------------------
   */

  const updateSleeping = (
    value: boolean,
  ) => {
    sleepingRef.current =
      value;

    setSleeping(value);
  };

  /*
   * ----------------------------------------------------------
   * CLEAR RETURN TIMER
   * ----------------------------------------------------------
   */

  const clearHomeTimer =
    () => {
      if (
        homeTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          homeTimerRef.current,
        );

        homeTimerRef.current =
          null;
      }
    };

  /*
   * ----------------------------------------------------------
   * START RETURN HOME
   * ----------------------------------------------------------
   *
   * This is called by the 10-second timer.
   */

  const startReturnHome =
    () => {
      /*
       * Get the latest navbar position.
       */

      const home =
        getHomePosition();

      homePositionRef.current =
        home;

      /*
       * Make home the destination.
       */

      destinationRef.current =
        {
          x: home.x,
          y: home.y,
        };

      /*
       * Explicitly mark Kernel as returning.
       */

      returningHomeRef.current =
        true;

      /*
       * Reset walking animation.
       */

      walkDistanceRef.current =
        0;

      /*
       * Wake Kernel while it walks home.
       */

      updateSleeping(false);

      /*
       * Close menu.
       */

      setMenuOpen(false);

      /*
       * IMPORTANT:
       * Start walking even if the previous state
       * somehow says otherwise.
       */

      walkingRef.current =
        true;
    };

  /*
   * ----------------------------------------------------------
   * SCHEDULE RETURN HOME
   * ----------------------------------------------------------
   *
   * Called ONLY after Kernel reaches a clicked location.
   */

  const scheduleReturnHome =
    () => {
      clearHomeTimer();

      /*
       * Kernel is waiting at the clicked location.
       */

      returningHomeRef.current =
        false;

      homeTimerRef.current =
        window.setTimeout(
          () => {
            /*
             * Timer has fired.
             */

            homeTimerRef.current =
              null;

            /*
             * Now begin the return journey.
             */

            startReturnHome();
          },
          10000,
        );
    };

  /*
   * ----------------------------------------------------------
   * CURSOR TRACKING
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handlePointerMove =
      (event: PointerEvent) => {
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
   */

  useEffect(() => {
    const handlePagePointerDown =
      (event: PointerEvent) => {
        const target =
          event.target;

        /*
         * Ignore clicks on Kernel itself.
         */

        if (
          target instanceof
            Element &&
          target.closest(
            "[data-kernel]",
          )
        ) {
          return;
        }

        /*
         * New page click completely resets
         * the previous return cycle.
         */

        clearHomeTimer();

        returningHomeRef.current =
          false;

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

        /*
         * Set clicked location.
         */

        destinationRef.current =
          {
            x: destinationX,
            y: destinationY,
          };

        walkDistanceRef.current =
          0;

        /*
         * Start walking.
         */

        walkingRef.current =
          true;

        /*
         * Wake Kernel.
         */

        updateSleeping(false);

        /*
         * Small reaction.
         */

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
    const handleKeyDown =
      (event: KeyboardEvent) => {
        if (
          event.key !==
          "Escape"
        ) {
          return;
        }

        setMenuOpen(false);

        if (
          !walkingRef.current
        ) {
          const home =
            homePositionRef.current;

          const position =
            positionRef.current;

          const distance =
            Math.hypot(
              position.x -
                home.x,
              position.y -
                home.y,
            );

          if (
            distance < 4
          ) {
            clearHomeTimer();

            returningHomeRef.current =
              false;

            updateSleeping(true);
          }
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

    let blinkEndTimer:
      number | null = null;

    const scheduleBlink =
      (delay: number) => {
        blinkTimerRef.current =
          window.setTimeout(
            () => {
              if (cancelled) {
                return;
              }

              if (
                walkingRef.current ||
                sleepingRef.current
              ) {
                scheduleBlink(
                  1200,
                );

                return;
              }

              setBotState(
                "blink",
              );

              blinkEndTimer =
                window.setTimeout(
                  () => {
                    if (
                      cancelled
                    ) {
                      return;
                    }

                    setBotState(
                      "idle",
                    );

                    const nextDelay =
                      1800 +
                      Math.random() *
                        3200;

                    scheduleBlink(
                      nextDelay,
                    );
                  },
                  110,
                );
            },
            delay,
          );
      };

    scheduleBlink(
      2200 +
        Math.random() * 1800,
    );

    return () => {
      cancelled = true;

      if (
        blinkTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          blinkTimerRef.current,
        );
      }

      if (
        blinkEndTimer !==
        null
      ) {
        window.clearTimeout(
          blinkEndTimer,
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
        Math.hypot(
          dx,
          dy,
        );

      /*
       * ------------------------------------------------------
       * WALKING
       * ------------------------------------------------------
       */

      if (
        walkingRef.current
      ) {
        /*
         * Arrived at destination.
         */

        if (
          distance <= 1.5
        ) {
          /*
           * Snap exactly to destination.
           */

          position.x =
            destination.x;

          position.y =
            destination.y;

          walkingRef.current =
            false;

          walkDistanceRef.current =
            0;

          /*
           * --------------------------------------------------
           * RETURNED HOME
           * --------------------------------------------------
           */

          if (
            returningHomeRef.current
          ) {
            /*
             * Make absolutely sure Kernel is exactly
             * at the latest navbar position.
             */

            const home =
              homePositionRef.current;

            position.x =
              home.x;

            position.y =
              home.y;

            destinationRef.current =
              {
                x: home.x,
                y: home.y,
              };

            returningHomeRef.current =
              false;

            clearHomeTimer();

            /*
             * Back home → sleep.
             */

            updateSleeping(true);
          } else {
            /*
             * ------------------------------------------------
             * ARRIVED AT CLICKED LOCATION
             * ------------------------------------------------
             *
             * Start the 10-second countdown HERE.
             */

            updateSleeping(false);

            scheduleReturnHome();
          }
        } else {
          /*
           * --------------------------------------------------
           * CONTINUE WALKING
           * --------------------------------------------------
           */

          const directionX =
            dx / distance;

          const directionY =
            dy / distance;

          const step =
            Math.min(
              WALK_SPEED,
              distance,
            );

          position.x +=
            directionX * step;

          position.y +=
            directionY * step;

          walkDistanceRef.current +=
            step;
        }
      }

      /*
       * ------------------------------------------------------
       * KEEP KERNEL INSIDE VIEWPORT
       * ------------------------------------------------------
       */

      const padding = 24;

      position.x =
        Math.max(
          padding,
          Math.min(
            window.innerWidth -
              padding,
            position.x,
          ),
        );

      position.y =
        Math.max(
          padding,
          Math.min(
            window.innerHeight -
              padding,
            position.y,
          ),
        );

      /*
       * ------------------------------------------------------
       * APPLY POSITION
       * ------------------------------------------------------
       */

      if (
        containerRef.current
      ) {
        containerRef.current.style.transform =
          `translate3d(${position.x}px, ${position.y}px, 0)`;
      }

      /*
       * ------------------------------------------------------
       * DRAW
       * ------------------------------------------------------
       */

      drawPixelCompanion();

      frame =
        window.requestAnimationFrame(
          animate,
        );
    };

    frame =
      window.requestAnimationFrame(
        animate,
      );

    return () => {
      window.cancelAnimationFrame(
        frame,
      );
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * RESIZE
   * ----------------------------------------------------------
   */

  useEffect(() => {
    const handleResize =
      () => {
        const home =
          getHomePosition();

        homePositionRef.current =
          home;

        /*
         * If Kernel is at home, keep it attached
         * to the navbar.
         */

        if (
          !walkingRef.current &&
          !returningHomeRef.current
        ) {
          const position =
            positionRef.current;

          const distance =
            Math.hypot(
              position.x -
                home.x,
              position.y -
                home.y,
            );

          if (
            distance < 4
          ) {
            positionRef.current =
              {
                x: home.x,
                y: home.y,
              };

            destinationRef.current =
              {
                x: home.x,
                y: home.y,
              };
          }
        }
      };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
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

    /*
     * --------------------------------------------------------
     * BODY / HEAD
     * --------------------------------------------------------
     */

    ctx.fillStyle =
      WHITE;

    ctx.fillRect(
      6,
      1,
      4,
      1,
    );

    ctx.fillRect(
      5,
      2,
      6,
      1,
    );

    ctx.fillRect(
      4,
      3,
      8,
      1,
    );

    ctx.fillRect(
      3,
      4,
      10,
      1,
    );

    ctx.fillRect(
      3,
      5,
      10,
      5,
    );

    ctx.fillRect(
      4,
      10,
      8,
      1,
    );

    ctx.fillRect(
      5,
      11,
      6,
      1,
    );

    /*
     * --------------------------------------------------------
     * WALK FRAME
     * --------------------------------------------------------
     */

    const walkFrame =
      Math.floor(
        walkDistanceRef.current /
          8,
      ) % 2;

    /*
     * --------------------------------------------------------
     * ARMS
     * --------------------------------------------------------
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
     * --------------------------------------------------------
     * EYES
     * --------------------------------------------------------
     */

    if (
      sleepingRef.current
    ) {
      /*
       * Tiny sleeping eyes.
       */

      ctx.fillStyle =
        DARK;

      ctx.fillRect(
        6,
        7,
        1,
        1,
      );

      ctx.fillRect(
        9,
        7,
        1,
        1,
      );
    } else if (
      botStateRef.current !==
      "blink"
    ) {
      /*
       * Awake eyes follow mouse.
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
        cursor.x -
        centerX;

      const dy =
        cursor.y -
        centerY;

      const distance =
        Math.hypot(
          dx,
          dy,
        );

      const eyeDistance =
        Math.min(
          1,
          distance / 70,
        );

      const angle =
        Math.atan2(
          dy,
          dx,
        );

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

      ctx.fillStyle =
        DARK;

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
     * --------------------------------------------------------
     * LEGS
     * --------------------------------------------------------
     */

    ctx.fillStyle =
      WHITE;

    if (!walkingRef.current) {
      // standing
      ctx.fillRect(5, 12, 2, 3);
      ctx.fillRect(4, 14, 3, 1);

      ctx.fillRect(9, 12, 2, 3);
      ctx.fillRect(9, 14, 3, 1);
    } else if (walkFrame === 0) {
      // walking frame 0
      ctx.fillRect(4, 12, 2, 3);
      ctx.fillRect(3, 14, 3, 1);

      ctx.fillRect(9, 12, 2, 2);
      ctx.fillRect(9, 14, 3, 1);
    } else {
      // walking frame 1
      ctx.fillRect(6, 12, 2, 2);
      ctx.fillRect(5, 14, 3, 1);

      ctx.fillRect(10, 12, 2, 3);
      ctx.fillRect(10, 14, 3, 1);
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
      window.setTimeout(
        () => {
          setReaction(false);
        },
        220,
      );
  }

  /*
   * ----------------------------------------------------------
   * CLEANUP
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

      if (
        homeTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          homeTimerRef.current,
        );
      }
    };
  }, []);

  /*
   * ----------------------------------------------------------
   * KERNEL CLICK
   * ----------------------------------------------------------
   */

  const handleKernelClick =
    (
      event: React.MouseEvent,
    ) => {
      event.stopPropagation();

      triggerReaction();

      /*
       * Wake Kernel.
       */

      updateSleeping(false);

      setMenuOpen(
        (current) => !current,
      );

      /*
       * If Kernel is standing somewhere away from
       * the navbar, clicking it resets the 10-second
       * countdown.
       */

      if (
        !walkingRef.current
      ) {
        const home =
          homePositionRef.current;

        const position =
          positionRef.current;

        const distance =
          Math.hypot(
            position.x -
              home.x,
            position.y -
              home.y,
          );

        if (
          distance >= 4
        ) {
          scheduleReturnHome();
        }
      }
    };

  /*
   * ----------------------------------------------------------
   * RENDER
   * ----------------------------------------------------------
   */

  return (
    <div
      ref={containerRef}
      data-kernel
      className="
        pointer-events-none
        fixed
        left-0
        top-0
        z-50
      "
      style={{
        transform:
          "translate3d(-90px, -90px, 0)",
      }}
    >
      <div
        className="
          relative
          -translate-x-1/2
          -translate-y-1/2
        "
      >
        {/*
         * ----------------------------------------------------
         * SLEEPING ZZZ
         * ----------------------------------------------------
         */}

        {sleeping && (
          <div
            className="
              pointer-events-none
              absolute
              -right-1
              -top-3
              h-7
              w-7
              select-none
              font-mono
              font-semibold
              leading-none
              text-foreground
            "
            aria-hidden="true"
          >
            <span
              className="
                absolute
                right-[2px]
                top-[13px]
                text-[8px]
                opacity-80
                animate-[kernel-sleep-1_2.8s_ease-in-out_infinite]
              "
            >
              z
            </span>

            <span
              className="
                absolute
                right-[6px]
                top-[7px]
                text-[10px]
                opacity-75
                animate-[kernel-sleep-2_2.8s_ease-in-out_infinite]
              "
            >
              z
            </span>

            <span
              className="
                absolute
                right-[9px]
                top-0
                text-[12px]
                opacity-70
                animate-[kernel-sleep-3_2.8s_ease-in-out_infinite]
              "
            >
              z
            </span>
          </div>
        )}

        {/*
         * ----------------------------------------------------
         * KERNEL MENU
         * ----------------------------------------------------
         */}

        <KernelMenu
          open={menuOpen}
          onClose={() => {
            setMenuOpen(false);

            if (
              !walkingRef.current
            ) {
              const home =
                homePositionRef.current;

              const position =
                positionRef.current;

              const distance =
                Math.hypot(
                  position.x -
                    home.x,
                  position.y -
                    home.y,
                );

              if (
                distance >= 4
              ) {
                /*
                 * Menu interaction while away
                 * resets the countdown.
                 */

                scheduleReturnHome();
              } else {
                /*
                 * At navbar → sleep.
                 */

                clearHomeTimer();

                returningHomeRef.current =
                  false;

                updateSleeping(true);
              }
            }
          }}
        />

        {/*
         * ----------------------------------------------------
         * KERNEL BUTTON
         * ----------------------------------------------------
         */}

        <button
          type="button"
          data-kernel
          aria-label="Open Kernel navigation"
          aria-expanded={menuOpen}
          onPointerDown={(event) => {
            event.stopPropagation();
          }}
          onClick={
            handleKernelClick
          }
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