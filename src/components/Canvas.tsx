import React, { RefObject, useEffect } from 'react';

import { useCanvas } from '@/hooks/useCanvas';
import { IRCP, RCP } from '@/RCP/RCP';
import { rcpTypes, rcpSize } from '@/RCP/constants';
import { getRandomNumExcludeMax } from '@/utils/utils';
import styled from 'styled-components';

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default function Canvas({ canvasWidth, canvasHeight }: CanvasProps) {
  const fillBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const rcpObj: { [index: number]: IRCP } = {};
  for (let i = 0; i < 3; i++) {
    rcpObj[i] = new RCP({
      id: i,
      startX: getRandomNumExcludeMax(rcpSize, canvasWidth - rcpSize),
      startY: getRandomNumExcludeMax(rcpSize, canvasHeight - rcpSize),
      type: rcpTypes[i % 3],
      limitX: canvasWidth,
      limitY: canvasHeight - rcpSize,
      size: rcpSize,
    });
  }

  const animateRCP = (ctx: CanvasRenderingContext2D) => {
    for (let idx in rcpObj) {
      const rcp = rcpObj[idx];
      rcp.animate(ctx);
      rcp.randomMove();
    }
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    fillBackground(ctx);
    animateRCP(ctx);
  };

  const { canvasRef, startAnimation, stopAnimation } = useCanvas(
    canvasWidth,
    canvasHeight,
    animate
  );

  useEffect(() => {
    for (let idx in rcpObj) {
      const rcp = rcpObj[idx];
      rcp.updateLimit(canvasWidth - rcpSize, canvasHeight - rcpSize);
    }
  }, [canvasWidth, canvasHeight]);
  return (
    <>
      <canvas ref={canvasRef} />
      <S_BtnWrapper>
        <S_Btn onClick={startAnimation}>start</S_Btn>
        <S_Btn onClick={stopAnimation}>stop</S_Btn>
      </S_BtnWrapper>
    </>
  );
}

const S_BtnWrapper = styled.div` 
  position: absolute;
  top: 0;
  left: 500px;`;
const S_Btn = styled.button`
  
`;
