// import { useEffect, useRef, useState } from "react";
// import { KERNEL_MENU } from "./data";

// type Pos = { x: number; y: number };

// /**
//  * Kernel — a tiny pixel companion. Follows the cursor with a lazy spring,
//  * looks toward it, blinks, reacts to clicks, and opens a small nav menu.
//  */
// export function Kernel() {
//   const [open, setOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [touch, setTouch] = useState(false);
//   const [squish, setSquish] = useState(false);
//   const [awake, setAwake] = useState(false);
//   const bodyRef = useRef<HTMLDivElement | null>(null);
//   const eyesRef = useRef<HTMLDivElement | null>(null);
//   const pos = useRef<Pos>({ x: 0, y: 0 });
//   const target = useRef<Pos>({ x: 0, y: 0 });
//   const vel = useRef<Pos>({ x: 0, y: 0 });

//   useEffect(() => {
//     setMounted(true);
//     const coarse =
//       typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
//     setTouch(coarse);
//     if (coarse) return;

//     pos.current = { x: window.innerWidth / 2, y: window.innerHeight * 0.7 };
//     target.current = { ...pos.current };

//     let raf = 0;
//     const onMove = (e: PointerEvent) => {
//       target.current = { x: e.clientX + 34, y: e.clientY + 30 };
//       setAwake(true);
//     };
//     const onDown = () => {
//       setSquish(true);
//       window.setTimeout(() => setSquish(false), 220);
//     };
//     const tick = () => {
//       // spring physics toward the trailing target
//       const k = 0.055;
//       const damp = 0.82;
//       vel.current.x = (vel.current.x + (target.current.x - pos.current.x) * k) * damp;
//       vel.current.y = (vel.current.y + (target.current.y - pos.current.y) * k) * damp;
//       pos.current.x += vel.current.x;
//       pos.current.y += vel.current.y;
//       if (bodyRef.current) {
//         bodyRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
//       }
//       if (eyesRef.current) {
//         const dx = Math.max(-1.6, Math.min(1.6, (target.current.x - pos.current.x) / 22));
//         const dy = Math.max(-1.4, Math.min(1.4, (target.current.y - pos.current.y) / 22));
//         eyesRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
//       }
//       raf = requestAnimationFrame(tick);
//     };
//     raf = requestAnimationFrame(tick);
//     window.addEventListener("pointermove", onMove, { passive: true });
//     window.addEventListener("pointerdown", onDown);
//     return () => {
//       cancelAnimationFrame(raf);
//       window.removeEventListener("pointermove", onMove);
//       window.removeEventListener("pointerdown", onDown);
//     };
//   }, []);

//   useEffect(() => {
//     const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, []);

//   if (!mounted) return null;

//   const sprite = (
//     <button
//       type="button"
//       aria-label="Kernel — open navigation"
//       onClick={(e) => {
//         e.stopPropagation();
//         setOpen((v) => !v);
//       }}
//       className="group relative grid h-11 w-11 place-items-center"
//     >
//       <span
//         className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
//         style={{
//           background:
//             "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
//         }}
//       />
//       <span
//         className="relative block transition-transform duration-200"
//         style={{
//           animation: "kernel-idle 3.2s ease-in-out infinite",
//           transform: squish ? "scale(0.82)" : undefined,
//         }}
//       >
//         <svg width="26" height="26" viewBox="0 0 13 13" shapeRendering="crispEdges">
//           {/* head shell — pixel blocks */}
//           <g fill="currentColor" className="text-foreground">
//             <rect x="3" y="1" width="7" height="1" />
//             <rect x="2" y="2" width="1" height="8" />
//             <rect x="10" y="2" width="1" height="8" />
//             <rect x="3" y="10" width="7" height="1" />
//             <rect x="3" y="2" width="7" height="8" opacity="0.14" />
//             <rect x="6" y="0" width="1" height="1" opacity="0.55" />
//           </g>
//           <g ref={eyesRef as never} className="text-foreground" fill="currentColor">
//             <rect
//               x="4"
//               y="5"
//               width="1"
//               height={squish ? 1 : 2}
//               style={{ animation: "blink-caret 6s steps(1) infinite" }}
//             />
//             <rect
//               x="8"
//               y="5"
//               width="1"
//               height={squish ? 1 : 2}
//               style={{ animation: "blink-caret 6s steps(1) infinite" }}
//             />
//           </g>
//           <rect x="6" y="8" width="1" height="1" className="fill-accent" opacity="0.9" />
//         </svg>
//       </span>
//     </button>
//   );

//   const menu = open && (
//     <div
//       className="absolute bottom-full right-0 mb-3 w-56 border border-border bg-popover/95 backdrop-blur-md"
//       onClick={(e) => e.stopPropagation()}
//     >
//       <div className="flex items-center justify-between border-b border-hairline px-3 py-2">
//         <span className="eyebrow">Kernel</span>
//         <span className="font-mono text-[10px] text-accent">online</span>
//       </div>
//       <nav className="py-1">
//         {KERNEL_MENU.map((item) => (
//           <a
//             key={item.label}
//             href={item.href}
//             target={item.external ? "_blank" : undefined}
//             rel={item.external ? "noreferrer" : undefined}
//             onClick={() => setOpen(false)}
//             className="flex items-baseline gap-3 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
//           >
//             <span className="text-accent/70">{item.index}</span>
//             <span>{item.label}</span>
//           </a>
//         ))}
//       </nav>
//     </div>
//   );

//   if (touch) {
//     return (
//       <div className="fixed bottom-5 right-5 z-50">
//         <div className="relative">
//           {menu}
//           <div className="border border-border bg-background/80 p-1 backdrop-blur">{sprite}</div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       ref={bodyRef}
//       className="pointer-events-none fixed left-0 top-0 z-50 hidden md:block"
//       style={{ opacity: awake ? 1 : 0, transition: "opacity 0.8s ease" }}
//     >
//       <div className="pointer-events-auto relative -translate-x-1/2 -translate-y-1/2">
//         {menu}
//         {sprite}
//       </div>
//     </div>
//   );
// }

// import { useEffect, useRef, useState } from "react";
// import { KERNEL_MENU } from "./data";

// type Point = {
//   x: number;
//   y: number;
// };

// const GRID = 16;
// const DISPLAY_SIZE = 32;

// const WHITE = "#F0F2F5";
// const DARK = "#090A0C";

// export function Kernel() {
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const containerRef = useRef<HTMLDivElement | null>(null);

//   /*
//    * ----------------------------------------------------------
//    * POSITION
//    * ----------------------------------------------------------
//    */

//   const positionRef = useRef<Point>({
//     x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,
//     y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
//   });

//   /*
//    * Where Kernel is walking.
//    *
//    * IMPORTANT:
//    * This changes ONLY after a click.
//    */
//   const destinationRef = useRef<Point>({
//     x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,
//     y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
//   });

//   /*
//    * Cursor is completely separate.
//    *
//    * It is ONLY used for the eyes.
//    */
//   const cursorRef = useRef<Point>({
//     x: 0,
//     y: 0,
//   });

//   /*
//    * Walking state.
//    */
//   const walkingRef = useRef(false);
//   const walkDistanceRef = useRef(0);

//   /*
//    * Click reaction.
//    */
//   const [reaction, setReaction] = useState(false);
//   const reactionTimerRef = useRef<number | null>(null);

//   const [menuOpen, setMenuOpen] = useState(false);

//   /*
//    * ----------------------------------------------------------
//    * CURSOR
//    * ----------------------------------------------------------
//    *
//    * Cursor movement NEVER moves Kernel.
//    */
//   useEffect(() => {
//     const handlePointerMove = (event: PointerEvent) => {
//       cursorRef.current = {
//         x: event.clientX,
//         y: event.clientY,
//       };
//     };

//     window.addEventListener("pointermove", handlePointerMove, {
//       passive: true,
//     });

//     return () => {
//       window.removeEventListener("pointermove", handlePointerMove);
//     };
//   }, []);

//   /*
//    * ----------------------------------------------------------
//    * PAGE CLICK
//    * ----------------------------------------------------------
//    *
//    * Clicking anywhere gives Kernel a destination.
//    */
//   useEffect(() => {
//     const handlePagePointerDown = (event: PointerEvent) => {
//       const padding = 35;

//       const destinationX = Math.max(
//         padding,
//         Math.min(window.innerWidth - padding, event.clientX),
//       );

//       const destinationY = Math.max(
//         padding,
//         Math.min(window.innerHeight - padding, event.clientY),
//       );

//       destinationRef.current = {
//         x: destinationX,
//         y: destinationY,
//       };

//       walkingRef.current = true;

//       triggerReaction();
//     };

//     window.addEventListener(
//       "pointerdown",
//       handlePagePointerDown,
//     );

//     return () => {
//       window.removeEventListener(
//         "pointerdown",
//         handlePagePointerDown,
//       );
//     };
//   }, []);

//   /*
//    * ----------------------------------------------------------
//    * ESCAPE
//    * ----------------------------------------------------------
//    */

//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.key === "Escape") {
//         setMenuOpen(false);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);

//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   /*
//    * ----------------------------------------------------------
//    * MAIN ANIMATION LOOP
//    * ----------------------------------------------------------
//    *
//    * This is NOT spring physics.
//    *
//    * Kernel walks at a capped speed.
//    */
//   useEffect(() => {
//     let frame = 0;

//     const animate = () => {
//       const position = positionRef.current;
//       const destination = destinationRef.current;

//       const dx = destination.x - position.x;
//       const dy = destination.y - position.y;

//       const distance = Math.hypot(dx, dy);

//       /*
//        * Walking speed.
//        *
//        * This is deliberately slow.
//        */
//       const WALK_SPEED = 1.35;

//       if (walkingRef.current && distance > 1.5) {
//         /*
//          * Normalized direction.
//          */
//         const directionX = dx / distance;
//         const directionY = dy / distance;

//         /*
//          * Move by a FIXED amount.
//          *
//          * This is what makes it walk instead of fly.
//          */
//         const step = Math.min(WALK_SPEED, distance);

//         position.x += directionX * step;
//         position.y += directionY * step;

//         walkDistanceRef.current += step;

//         /*
//          * Stop exactly at the destination.
//          */
//         if (distance <= WALK_SPEED + 0.5) {
//           position.x = destination.x;
//           position.y = destination.y;

//           walkingRef.current = false;
//           walkDistanceRef.current = 0;
//         }
//       } else {
//         walkingRef.current = false;
//       }

//       /*
//        * Keep Kernel inside the viewport.
//        */
//       const padding = 24;

//       position.x = Math.max(
//         padding,
//         Math.min(window.innerWidth - padding, position.x),
//       );

//       position.y = Math.max(
//         padding,
//         Math.min(window.innerHeight - padding, position.y),
//       );

//       if (containerRef.current) {
//         containerRef.current.style.transform =
//           `translate3d(${position.x}px, ${position.y}px, 0)`;
//       }

//       drawPixelCompanion();

//       frame = requestAnimationFrame(animate);
//     };

//     frame = requestAnimationFrame(animate);

//     return () => {
//       cancelAnimationFrame(frame);
//     };
//   }, []);

//   /*
//    * ----------------------------------------------------------
//    * PIXEL COMPANION
//    * ----------------------------------------------------------
//    *
//    * Based directly on Gemini's 16x16 pixel drawing.
//    */
//   function drawPixelCompanion() {
//     const canvas = canvasRef.current;

//     if (!canvas) return;

//     const ctx = canvas.getContext("2d");

//     if (!ctx) return;

//     ctx.imageSmoothingEnabled = false;

//     ctx.clearRect(0, 0, GRID, GRID);

//     /*
//      * --------------------------------------------------------
//      * HEAD / HAT
//      * --------------------------------------------------------
//      */

//     ctx.fillStyle = WHITE;

//     ctx.fillRect(4, 1, 8, 1);
//     ctx.fillRect(3, 2, 10, 2);

//     /*
//      * --------------------------------------------------------
//      * FACE
//      * --------------------------------------------------------
//      */

//     ctx.fillRect(2, 4, 12, 4);

//     /*
//      * --------------------------------------------------------
//      * EYES
//      * --------------------------------------------------------
//      *
//      * Eyes follow the cursor.
//      */
//     const rect = canvas.getBoundingClientRect();

//     const centerX = rect.left + rect.width / 2;
//     const centerY = rect.top + rect.height / 2;

//     const cursor = cursorRef.current;

//     const dx = cursor.x - centerX;
//     const dy = cursor.y - centerY;

//     const distance = Math.hypot(dx, dy);

//     const eyeDistance = Math.min(
//       1.5,
//       distance / 60,
//     );

//     const angle = Math.atan2(dy, dx);

//     const eyeX = Math.round(
//       Math.cos(angle) * eyeDistance,
//     );

//     const eyeY = Math.round(
//       Math.sin(angle) * eyeDistance,
//     );

//     ctx.fillStyle = DARK;

//     ctx.fillRect(
//       4 + eyeX,
//       5 + eyeY,
//       2,
//       2,
//     );

//     ctx.fillRect(
//       9 + eyeX,
//       5 + eyeY,
//       2,
//       2,
//     );

//     /*
//      * --------------------------------------------------------
//      * BODY
//      * --------------------------------------------------------
//      */

//     ctx.fillStyle = WHITE;

//     ctx.fillRect(3, 8, 10, 4);

//     /*
//      * Arms.
//      */
//     ctx.fillRect(2, 9, 12, 2);

//     /*
//      * --------------------------------------------------------
//      * WALKING LEGS
//      * --------------------------------------------------------
//      *
//      * Two tiny alternating frames.
//      *
//      * When stationary:
//      * normal standing pose.
//      *
//      * When walking:
//      * legs alternate.
//      */
//     const walkFrame =
//       Math.floor(walkDistanceRef.current / 6) % 2;

//     if (!walkingRef.current) {
//       /*
//        * Standing.
//        */
//       ctx.fillRect(4, 12, 3, 3);
//       ctx.fillRect(9, 12, 3, 3);

//       ctx.fillStyle = DARK;
//       ctx.fillRect(7, 12, 2, 2);
//     } else if (walkFrame === 0) {
//       /*
//        * Walking frame A.
//        */
//       ctx.fillRect(3, 12, 3, 3);
//       ctx.fillRect(10, 12, 3, 3);

//       ctx.fillStyle = DARK;
//       ctx.fillRect(7, 12, 2, 2);
//     } else {
//       /*
//        * Walking frame B.
//        */
//       ctx.fillRect(5, 12, 3, 3);
//       ctx.fillRect(8, 12, 3, 3);

//       ctx.fillStyle = DARK;
//       ctx.fillRect(7, 12, 1, 2);
//     }
//   }

//   /*
//    * ----------------------------------------------------------
//    * REACTION
//    * ----------------------------------------------------------
//    */

//   function triggerReaction() {
//     setReaction(true);

//     if (reactionTimerRef.current !== null) {
//       window.clearTimeout(reactionTimerRef.current);
//     }

//     reactionTimerRef.current = window.setTimeout(() => {
//       setReaction(false);
//     }, 220);
//   }

//   /*
//    * ----------------------------------------------------------
//    * CLEANUP
//    * ----------------------------------------------------------
//    */

//   useEffect(() => {
//     return () => {
//       if (reactionTimerRef.current !== null) {
//         window.clearTimeout(
//           reactionTimerRef.current,
//         );
//       }
//     };
//   }, []);

//   /*
//    * ----------------------------------------------------------
//    * MENU
//    * ----------------------------------------------------------
//    */

//   const menu = menuOpen ? (
//     <div
//       className="absolute bottom-full right-0 mb-3 w-52 border border-border bg-popover/95 p-2 shadow-2xl backdrop-blur-md"
//       onPointerDown={(event) => {
//         event.stopPropagation();
//       }}
//     >
//       <div className="mb-1 border-b border-border px-2 pb-2">
//         <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
//           Kernel
//         </span>
//       </div>

//       <nav className="flex flex-col">
//         {KERNEL_MENU.map((item) => (
//           <a
//             key={item.label}
//             href={item.href}
//             target={
//               item.external
//                 ? "_blank"
//                 : undefined
//             }
//             rel={
//               item.external
//                 ? "noreferrer"
//                 : undefined
//             }
//             onClick={() => {
//               setMenuOpen(false);
//             }}
//             className="flex items-center gap-2 px-2 py-2 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
//           >
//             <span className="w-5 text-accent/70">
//               {item.index}
//             </span>

//             <span>{item.label}</span>
//           </a>
//         ))}
//       </nav>
//     </div>
//   ) : null;

//   /*
//    * ----------------------------------------------------------
//    * RENDER
//    * ----------------------------------------------------------
//    */

//   return (
//     <div
//       ref={containerRef}
//       className="pointer-events-none fixed left-0 top-0 z-50"
//       style={{
//         transform:
//           "translate3d(-90px, -90px, 0)",
//       }}
//     >
//       <div className="relative -translate-x-1/2 -translate-y-1/2">
//         {menu}

//         <button
//           type="button"
//           aria-label="Open Kernel navigation"
//           aria-expanded={menuOpen}
//           onPointerDown={(event) => {
//             /*
//              * Kernel itself is NOT a page destination.
//              */
//             event.stopPropagation();
//           }}
//           onClick={(event) => {
//             event.stopPropagation();

//             triggerReaction();

//             setMenuOpen((current) => !current);
//           }}
//           className="pointer-events-auto flex h-10 w-10 items-center justify-center focus:outline-none"
//         >
//           <canvas
//             ref={canvasRef}
//             width={DISPLAY_SIZE / 2}
//             height={DISPLAY_SIZE / 2}
//             className="h-8 w-8"
//             style={{
//               width: `${DISPLAY_SIZE}px`,
//               height: `${DISPLAY_SIZE}px`,
//               imageRendering: "pixelated",
//               animation: reaction
//                 ? "kernel-hop 220ms steps(3, end)"
//                 : "none",
//             }}
//           />
//         </button>
//       </div>
//     </div>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { KERNEL_MENU } from "./data";

type Point = {
  x: number;
  y: number;
};

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
   */

  const positionRef = useRef<Point>({
    x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
  });

  /*
   * Where Kernel is walking.
   */
  const destinationRef = useRef<Point>({
    x: typeof window !== "undefined" ? window.innerWidth - 90 : 0,
    y: typeof window !== "undefined" ? window.innerHeight - 90 : 0,
  });

  /*
   * Cursor for tracking eye direction.
   */
  const cursorRef = useRef<Point>({
    x: 0,
    y: 0,
  });

  /*
   * Walking state.
   */
  const walkingRef = useRef(false);
  const walkDistanceRef = useRef(0);

  /*
   * Click reaction.
   */
  const [reaction, setReaction] = useState(false);
  const reactionTimerRef = useRef<number | null>(null);

  const [menuOpen, setMenuOpen] = useState(false);

  /*
   * ----------------------------------------------------------
   * CURSOR
   * ----------------------------------------------------------
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
   * PAGE CLICK
   * ----------------------------------------------------------
   */
  useEffect(() => {
    const handlePagePointerDown = (event: PointerEvent) => {
      const padding = 35;

      const destinationX = Math.max(
        padding,
        Math.min(window.innerWidth - padding, event.clientX),
      );

      const destinationY = Math.max(
        padding,
        Math.min(window.innerHeight - padding, event.clientY),
      );

      destinationRef.current = {
        x: destinationX,
        y: destinationY,
      };

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
   * MAIN ANIMATION LOOP
   * ----------------------------------------------------------
   */
  useEffect(() => {
    let frame = 0;

    const animate = () => {
      const position = positionRef.current;
      const destination = destinationRef.current;

      const dx = destination.x - position.x;
      const dy = destination.y - position.y;

      const distance = Math.hypot(dx, dy);
      const WALK_SPEED = 1.35;

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

      const padding = 24;

      position.x = Math.max(
        padding,
        Math.min(window.innerWidth - padding, position.x),
      );

      position.y = Math.max(
        padding,
        Math.min(window.innerHeight - padding, position.y),
      );

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
   * PIXEL COMPANION DRAWING (EXACT IMAGE RECREATION)
   * ----------------------------------------------------------
   */
  function drawPixelCompanion() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, GRID, GRID);

    ctx.fillStyle = WHITE;

    // 1. ROUNDED HEAD & DOME BODY
    ctx.fillRect(6, 1, 4, 1);   // Top curve
    ctx.fillRect(5, 2, 6, 1);   // Upper dome
    ctx.fillRect(4, 3, 8, 8);   // Main torso block
    ctx.fillRect(5, 11, 6, 1);  // Bottom body curve

    // 2. ARMS
    const walkFrame = Math.floor(walkDistanceRef.current / 6) % 2;

    if (!walkingRef.current) {
      // Resting arms (slanted downward as seen in image)
      ctx.fillRect(3, 7, 1, 2);
      ctx.fillRect(12, 7, 1, 2);
    } else if (walkFrame === 0) {
      // Arm swing A
      ctx.fillRect(3, 6, 1, 2);
      ctx.fillRect(12, 8, 1, 2);
    } else {
      // Arm swing B
      ctx.fillRect(3, 8, 1, 2);
      ctx.fillRect(12, 6, 1, 2);
    }

    // 3. EYES WITH CURSOR TRACKING
    const rect = canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const cursor = cursorRef.current;
    const dx = cursor.x - centerX;
    const dy = cursor.y - centerY;

    const distance = Math.hypot(dx, dy);
    const eyeDistance = Math.min(1.2, distance / 60);
    const angle = Math.atan2(dy, dx);

    const eyeX = Math.round(Math.cos(angle) * eyeDistance);
    const eyeY = Math.round(Math.sin(angle) * eyeDistance);

    // Render 1x2 Vertical Pupil Slits
    ctx.fillStyle = DARK;
    ctx.fillRect(6 + eyeX, 6 + eyeY, 1, 2); // Left Eye Slit
    ctx.fillRect(9 + eyeX, 6 + eyeY, 1, 2); // Right Eye Slit

    // 4. LEGS & FEET (EXACT IMAGE LEG PROFILE)
    ctx.fillStyle = WHITE;

    if (!walkingRef.current) {
      // Default Standing Pose (L-shaped feet facing outward)
      // Left leg
      ctx.fillRect(5, 12, 1, 2);
      ctx.fillRect(4, 13, 2, 1);

      // Right leg
      ctx.fillRect(10, 12, 1, 2);
      ctx.fillRect(10, 13, 2, 1);
    } else if (walkFrame === 0) {
      // Walking Step A
      ctx.fillRect(4, 12, 1, 2);
      ctx.fillRect(3, 13, 2, 1);

      ctx.fillRect(10, 12, 1, 1);
      ctx.fillRect(10, 13, 2, 1);
    } else {
      // Walking Step B
      ctx.fillRect(5, 12, 1, 1);
      ctx.fillRect(4, 13, 2, 1);

      ctx.fillRect(11, 12, 1, 2);
      ctx.fillRect(11, 13, 2, 1);
    }
  }

  function triggerReaction() {
    setReaction(true);

    if (reactionTimerRef.current !== null) {
      window.clearTimeout(reactionTimerRef.current);
    }

    reactionTimerRef.current = window.setTimeout(() => {
      setReaction(false);
    }, 220);
  }

  useEffect(() => {
    return () => {
      if (reactionTimerRef.current !== null) {
        window.clearTimeout(reactionTimerRef.current);
      }
    };
  }, []);

  const menu = menuOpen ? (
    <div
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

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed left-0 top-0 z-50"
      style={{
        transform: "translate3d(-90px, -90px, 0)",
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {menu}

        <button
          type="button"
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
          className="pointer-events-auto flex h-10 w-10 items-center justify-center focus:outline-none"
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