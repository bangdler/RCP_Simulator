import React, { RefObject } from 'react';

import { useCanvas } from '@/hooks/useCanvas';

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default function Canvas({ canvasWidth, canvasHeight }: CanvasProps) {

  const fillBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const canvasRef: RefObject<HTMLCanvasElement> = useCanvas(
    canvasWidth,
    canvasHeight,
    fillBackground
  );

  return <canvas ref={canvasRef} />;
}
