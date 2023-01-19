import {
  MutableRefObject,
  RefObject,
  useEffect,
  useRef,
} from 'react';

type useCanvas = {
  canvasRef: RefObject<HTMLCanvasElement>;
  startAnimation: () => void;
  stopAnimation: () => void;
  setAnimation: () => void;
};
export const useCanvas = (
  canvasWidth: number,
  canvasHeight: number,
  animate: (ctx: CanvasRenderingContext2D) => void
): useCanvas => {
  const canvasRef: RefObject<HTMLCanvasElement> = useRef(null);
  const requestId: MutableRefObject<number> = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    const setCanvas = () => {
      const devicePixelRatio = window.devicePixelRatio ?? 1;

      if (canvas && ctx) {
        canvas.style.width = `${canvasWidth}px`;
        canvas.style.height = `${canvasHeight}px`;
        canvas.width = canvasWidth * devicePixelRatio;
        canvas.height = canvasHeight * devicePixelRatio;
        ctx.scale(devicePixelRatio, devicePixelRatio);
      }
    };

    setCanvas();

    if (ctx) {
      animate(ctx);
    }

    return () => {
      window.cancelAnimationFrame(requestId.current);
      requestId.current = 0;
    };
  }, [canvasWidth, canvasHeight]);

  const setAnimation = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx) {
      animate(ctx);
    }
  };

  const startAnimation = () => {
    if (requestId.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const requestAnimation = () => {
      requestId.current = window.requestAnimationFrame(requestAnimation);
      if (ctx) {
        animate(ctx);
      }
    };
    requestAnimation();
  };

  const stopAnimation = () => {
    if (!requestId.current) return;
    window.cancelAnimationFrame(requestId.current);
    requestId.current = 0;
  };

  return { canvasRef, startAnimation, stopAnimation, setAnimation };
};
