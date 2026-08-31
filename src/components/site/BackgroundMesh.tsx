import { useEffect, useRef } from "react";

type Point = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
};

const GRID_SPACING = 115;
const MAX_DPR = 1.5;

const MOUSE_RADIUS = 240;
const MOUSE_STRENGTH = 18;

const LINE_OPACITY = 0.055;
const NODE_OPACITY = 0.12;

export function BackgroundMesh() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const mouseRef = useRef({
    x: -1000,
    y: -1000,
    active: false,
  });

  const pointsRef = useRef<Point[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    /*
     * --------------------------------------------------------
     * BUILD MESH
     * --------------------------------------------------------
     */

    const buildMesh = () => {
      pointsRef.current = [];

      const columns = Math.ceil(width / GRID_SPACING) + 2;
      const rows = Math.ceil(height / GRID_SPACING) + 2;

      const offsetX = -GRID_SPACING;
      const offsetY = -GRID_SPACING;

      for (let row = 0; row < rows; row++) {
        for (let column = 0; column < columns; column++) {
          const baseX = offsetX + column * GRID_SPACING;

          const baseY = offsetY + row * GRID_SPACING;

          /*
           * Slight irregularity keeps the mesh
           * from looking like a perfect CSS grid.
           */
          const jitterX = Math.sin(row * 1.73 + column * 0.91) * 12;

          const jitterY = Math.cos(row * 1.17 + column * 1.43) * 10;

          pointsRef.current.push({
            x: baseX + jitterX,
            y: baseY + jitterY,
            baseX: baseX + jitterX,
            baseY: baseY + jitterY,
            phase: row * 0.73 + column * 1.17,
            speed: 0.00035 + ((row + column) % 4) * 0.00008,
          });
        }
      }
    };

    /*
     * --------------------------------------------------------
     * RESIZE
     * --------------------------------------------------------
     */

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildMesh();
    };

    /*
     * --------------------------------------------------------
     * MOUSE
     * --------------------------------------------------------
     *
     * The mouse DOES NOT move the mesh globally.
     *
     * It only creates a small local disturbance.
     */

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current.x = event.clientX;
      mouseRef.current.y = event.clientY;
      mouseRef.current.active = true;
    };

    const handlePointerLeave = () => {
      mouseRef.current.active = false;
    };

    /*
     * --------------------------------------------------------
     * DRAW
     * --------------------------------------------------------
     */

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      const points = pointsRef.current;

      const mouse = mouseRef.current;

      /*
       * Animate points.
       */
      for (const point of points) {
        const ambientX = Math.sin(time * point.speed + point.phase) * 2.2;

        const ambientY = Math.cos(time * point.speed * 0.9 + point.phase) * 2.2;

        let targetX = point.baseX + ambientX;

        let targetY = point.baseY + ambientY;

        /*
         * ----------------------------------------------------
         * CURSOR DISTORTION
         * ----------------------------------------------------
         *
         * Only points close to the cursor move.
         *
         * This creates the "living mesh" effect without
         * making the entire background chase the cursor.
         */

        if (mouse.active) {
          const dx = mouse.x - targetX;
          const dy = mouse.y - targetY;

          const distance = Math.hypot(dx, dy);

          if (distance > 0 && distance < MOUSE_RADIUS) {
            const influence = 1 - distance / MOUSE_RADIUS;

            const easedInfluence = influence * influence;

            /*
             * Push the nearby mesh points
             * gently away from the cursor.
             */
            targetX -= (dx / distance) * MOUSE_STRENGTH * easedInfluence;

            targetY -= (dy / distance) * MOUSE_STRENGTH * easedInfluence;
          }
        }

        /*
         * Smoothly approach the calculated position.
         */
        point.x += (targetX - point.x) * 0.08;

        point.y += (targetY - point.y) * 0.08;
      }

      /*
       * ----------------------------------------------------
       * CONNECTIONS
       * ----------------------------------------------------
       */

      const columns = Math.ceil(width / GRID_SPACING) + 2;

      for (let i = 0; i < points.length; i++) {
        const point = points[i];

        if (!point) continue;

        const column = i % columns;

        /*
         * Horizontal connection.
         */
        if (column < columns - 1) {
          const right = points[i + 1];

          if (right) {
            drawLine(ctx, point, right, LINE_OPACITY);
          }
        }

        /*
         * Vertical connection.
         */
        const below = points[i + columns];

        if (below) {
          drawLine(ctx, point, below, LINE_OPACITY);
        }

        /*
         * Occasional diagonal connection.
         *
         * This gives the mesh the more organic
         * technical-network appearance.
         */
        if (column < columns - 1 && Math.floor(i / columns) % 2 === 0) {
          const diagonal = points[i + columns + 1];

          if (diagonal) {
            drawLine(ctx, point, diagonal, LINE_OPACITY * 0.7);
          }
        }
      }

      /*
       * ----------------------------------------------------
       * NODES
       * ----------------------------------------------------
       */

      for (const point of points) {
        /*
         * Determine whether this node is near
         * the cursor.
         */
        let nodeOpacity = NODE_OPACITY;

        let nodeRadius = 1.2;

        if (mouse.active) {
          const distance = Math.hypot(mouse.x - point.x, mouse.y - point.y);

          if (distance < MOUSE_RADIUS) {
            const influence = 1 - distance / MOUSE_RADIUS;

            nodeOpacity += influence * 0.16;

            nodeRadius += influence * 1.2;
          }
        }

        ctx.beginPath();

        ctx.arc(point.x, point.y, nodeRadius, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(220, 225, 232, ${nodeOpacity})`;

        ctx.fill();
      }

      /*
       * ----------------------------------------------------
       * SUBTLE CURSOR NODE
       * ----------------------------------------------------
       *
       * A very faint point appears around the cursor.
       * It gives the mesh a responsive feeling without
       * creating a flashy cursor effect.
       */

      if (mouse.active) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 85);

        gradient.addColorStop(0, "rgba(220, 225, 232, 0.055)");

        gradient.addColorStop(1, "rgba(220, 225, 232, 0)");

        ctx.fillStyle = gradient;

        ctx.fillRect(mouse.x - 85, mouse.y - 85, 170, 170);
      }

      animationFrame = requestAnimationFrame(draw);
    };

    /*
     * --------------------------------------------------------
     * LINE HELPER
     * --------------------------------------------------------
     */

    const drawLine = (
      context: CanvasRenderingContext2D,
      from: Point,
      to: Point,
      opacity: number,
    ) => {
      context.beginPath();

      context.moveTo(from.x, from.y);

      context.lineTo(to.x, to.y);

      context.strokeStyle = `rgba(170, 178, 190, ${opacity})`;

      context.lineWidth = 0.7;

      context.stroke();
    };

    /*
     * --------------------------------------------------------
     * INITIALIZE
     * --------------------------------------------------------
     */

    resize();

    window.addEventListener("resize", resize);

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    window.addEventListener("pointerleave", handlePointerLeave);

    animationFrame = requestAnimationFrame(draw);

    /*
     * --------------------------------------------------------
     * CLEANUP
     * --------------------------------------------------------
     */

    return () => {
      cancelAnimationFrame(animationFrame);

      window.removeEventListener("resize", resize);

      window.removeEventListener("pointermove", handlePointerMove);

      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
      style={{
        opacity: 0.9,
      }}
    />
  );
}

export default BackgroundMesh;
