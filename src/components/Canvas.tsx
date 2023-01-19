import React, {
  MouseEventHandler,
  useMemo,
  useEffect,
  useState,
} from 'react';
import styled from 'styled-components';

import { useCanvas } from '@/hooks/useCanvas';
import { HAND_SIZE, HAND_TYPES, INIT_NUM } from '@/Hand/constants';
import { HandTable, I_HandTable } from '@/Hand/HandTable';

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default function Canvas({ canvasWidth, canvasHeight }: CanvasProps) {
  const [lastHand, setLastHand] = useState<string>('');
  const [chooseHand, setChooseHand] = useState<string>('');
  const [aniVelocity, setAniVelocity] = useState<number>(1);

  const handTable: I_HandTable = useMemo(
    () =>
      new HandTable({
        initNum: INIT_NUM,
        handTypes: HAND_TYPES,
        width: canvasWidth,
        height: canvasHeight,
        size: HAND_SIZE,
      }),
    [canvasWidth, canvasHeight, INIT_NUM, HAND_TYPES, HAND_SIZE]
  );

  const fillBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'aquamarine';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    fillBackground(ctx);
    if (Object.values(handTable.numOfHands).filter(x => x === 0).length === 2) {
      stopAnimation();
      for (let key in handTable.numOfHands) {
        if (handTable.numOfHands[key] !== 0) setLastHand(key);
      }
    }
    setAniVelocity(handTable.velocity);
    handTable.animateHands(ctx);
  };

  const reset = () => {
    setChooseHand('');
    setLastHand('');
    setAniVelocity(1);
    stopAnimation();
    handTable.resetTable();
    setAnimation();
  };

  const { canvasRef, startAnimation, stopAnimation, setAnimation } = useCanvas(
    canvasWidth,
    canvasHeight,
    animate
  );

  const onClickChooseBtn: MouseEventHandler<HTMLDivElement> = ({ target }) => {
    if (!(target instanceof HTMLButtonElement)) return;
    if (typeof target.dataset.hand !== 'string') return;
    if (lastHand !== '') return;
    setChooseHand(target.dataset.hand);
  };

  useEffect(() => {
    for (let idx in handTable.handTable) {
      const hand = handTable.handTable[idx];
      hand.updateLimit(canvasWidth - HAND_SIZE, canvasHeight - HAND_SIZE);
    }
  }, [canvasWidth, canvasHeight]);

  return (
    <S_Wrapper>
      <S_Title>가위바위보의 승자는 누구?</S_Title>
      <S_ChooseContainer onClick={onClickChooseBtn}>
        {HAND_TYPES.map((hand, idx) => (
          <S_ChooseBtn key={idx} data-hand={hand} choose={hand === chooseHand}>
            {hand}
          </S_ChooseBtn>
        ))}
      </S_ChooseContainer>
      <S_Container>
        <canvas ref={canvasRef} />
        <S_BtnContainer>
          <S_Btn onClick={startAnimation}>start</S_Btn>
          <S_Btn onClick={stopAnimation}>stop</S_Btn>
          <S_Btn onClick={reset}>reset</S_Btn>
        </S_BtnContainer>
      </S_Container>
      <S_Span>{aniVelocity} 배속입니다.</S_Span>
      {lastHand === '' ? (
        ''
      ) : (
        <S_Span>
          {chooseHand === lastHand ? '정답!' : '땡!'} 최종 승자는 {lastHand}{' '}
          입니다.
        </S_Span>
      )}
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

const S_ChooseContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  * {
    margin: 10px;
  }
`;

const S_ChooseBtn = React.memo(styled.button<{ choose: boolean }>`
  background: aquamarine;
  font-size: 20px;
  border-radius: 4px;
  padding: 5px;
  border: ${({ choose }) =>
    choose ? `1px solid red` : `1px solid aquamarine`};
`);

const S_Container = styled.div`
  display: flex;
  * {
    margin: 10px;
  }
`;

const S_BtnContainer = styled.div`
  display: flex;
  flex-flow: column;
  * {
    margin: 10px;
  }
`;

const S_Btn = React.memo(styled.button`
  background: aquamarine;
  font-size: 20px;
  border-radius: 4px;
  padding: 5px;
`);

const S_Span = styled.span`
  font-size: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 4px;
`;
