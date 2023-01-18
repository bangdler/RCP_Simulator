import React, { useEffect } from 'react';
import styled from 'styled-components';

import { useCanvas } from '@/hooks/useCanvas';
import { I_Hand, Hand } from '@/Hand/Hand';
import {
  HAND_SIZE,
  HAND_TYPES,
  LOSE,
  WIN,
  DRAW,
  INIT_NUM,
} from '@/Hand/constants';
import { getRandomNumExcludeMax } from '@/utils/utils';
import { HandTable, I_HandTable } from '@/Hand/HandTable';

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default function Canvas({ canvasWidth, canvasHeight }: CanvasProps) {
  const handTable: I_HandTable = new HandTable({
    initNum: INIT_NUM,
    handTypes: HAND_TYPES,
    width: canvasWidth,
    height: canvasHeight,
    size: HAND_SIZE,
  });

  const fillBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'aquamarine';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    fillBackground(ctx);
    if (Object.values(handTable.numOfHands).filter(x => x === 0).length === 2) {
      stopAnimation();
    }
    handTable.animateHands(ctx);
  };

  const reset = () => {
    stopAnimation();
    handTable.resetTable();
    setAnimation();
  };

  const { canvasRef, startAnimation, stopAnimation, setAnimation } = useCanvas(
    canvasWidth,
    canvasHeight,
    animate
  );

  useEffect(() => {
    for (let idx in handTable.handTable) {
      const hand = handTable.handTable[idx];
      hand.updateLimit(canvasWidth - HAND_SIZE, canvasHeight - HAND_SIZE);
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <S_Wrapper>
      <S_Title>가위바위보의 승자는 누구?</S_Title>
      <S_Container>
        <canvas ref={canvasRef} />
        <S_BtnContainer>
          <S_Btn onClick={startAnimation}>start</S_Btn>
          <S_Btn onClick={stopAnimation}>stop</S_Btn>
          <S_Btn onClick={reset}>reset</S_Btn>
        </S_BtnContainer>
      </S_Container>
    </S_Wrapper>
  );
}

const S_Wrapper = styled.div`
  display: flex;
  flex-flow: column;
`;

const S_Title = styled.h1`
  font-size: 20px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const S_Container = styled.div`
  display: flex;
  * {
    margin-right: 10px;
  }
`;

const S_BtnContainer = styled.div`
  display: flex;
  flex-flow: column;
  *{
    margin: 10px;
  }
`;
const S_Btn = styled.button`
  background: aquamarine;
  font-size: 20px;
  border-radius: 4px;
  padding: 5px;
`;
