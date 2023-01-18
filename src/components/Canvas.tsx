import React, { useEffect } from 'react';

import { useCanvas } from '@/hooks/useCanvas';
import { IRCP, RCP } from '@/RCP/RCP';
import {
  RCP_SIZE,
  RCP_TYPES,
  FIGHTING,
  LOSE,
  WIN,
  DRAW,
  INIT_NUM,
} from '@/RCP/constants';
import { getRandomNumExcludeMax } from '@/utils/utils';
import styled from 'styled-components';

type CanvasProps = {
  canvasWidth: number;
  canvasHeight: number;
};

export default function Canvas({ canvasWidth, canvasHeight }: CanvasProps) {
  const numOfRCP = {
    [RCP_TYPES[0]]: INIT_NUM,
    [RCP_TYPES[1]]: INIT_NUM,
    [RCP_TYPES[2]]: INIT_NUM,
  };

  const makeRcpTable = (): { [index: number]: IRCP } => {
    const obj: { [index: number]: IRCP } = {};
    for (let i = 0; i < INIT_NUM * 3; i++) {
      obj[i] = new RCP({
        id: i,
        startX: getRandomNumExcludeMax(RCP_SIZE, canvasWidth - RCP_SIZE),
        startY: getRandomNumExcludeMax(RCP_SIZE, canvasHeight - RCP_SIZE),
        type: RCP_TYPES[i % 3],
        limitX: canvasWidth,
        limitY: canvasHeight - RCP_SIZE,
        size: RCP_SIZE,
      });
    }
    return obj;
  };

  const rcpTable: { [index: number]: IRCP } = makeRcpTable();

  const getOverlaps = (): { [index: number]: Array<string> } => {
    const overlaps: { [index: number]: Array<string> } = {};
    for (let i in rcpTable) {
      const cur = rcpTable[i];
      for (let j in rcpTable) {
        const compare = rcpTable[j];
        if (cur.id === compare.id) continue;
        const [diffX, diffY] = [
          Math.abs(cur.curX - compare.curX),
          Math.abs(cur.curY - compare.curY),
        ];
        if (diffX > RCP_SIZE || diffY > RCP_SIZE) continue;
        // 겹치는 경우 대결을 진행하고 결과값을 배열에 넣는다.
        const fightResult = cur.fight(compare.type);
        if (!overlaps[cur.id]) {
          overlaps[cur.id] = [fightResult];
        } else {
          overlaps[cur.id].push(fightResult);
        }
      }
    }
    return overlaps;
  };

  const setFightResultIfOverlap = () => {
    const overlaps = getOverlaps();
    for (let idx in overlaps) {
      const overlappedRcp = rcpTable[idx];
      const fightResults = overlaps[idx];

      if (fightResults.includes(LOSE) && !fightResults.includes(WIN)) {
        overlappedRcp.setFightResult(LOSE);
      } else if (fightResults.includes(WIN) && !fightResults.includes(LOSE)) {
        overlappedRcp.setFightResult(WIN);
      } else {
        overlappedRcp.setFightResult(DRAW);
      }
    }
  };

  const animateRCP = (ctx: CanvasRenderingContext2D) => {
    if (Object.values(numOfRCP).filter(x => x === 0).length === 2) {
      stopAnimation();
    }
    for (let idx in rcpTable) {
      const rcp = rcpTable[idx];
      if (rcp.fightResult === LOSE) {
        numOfRCP[rcp.type] -= 1;
        delete rcpTable[idx];
        continue;
      }
      rcp.animate(ctx);
      rcp.randomMove();
    }
    setFightResultIfOverlap();
  };

  const fillBackground = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  };

  const animate = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    fillBackground(ctx);
    animateRCP(ctx);
  };

  const { canvasRef, startAnimation, stopAnimation } = useCanvas(
    canvasWidth,
    canvasHeight,
    animate
  );

  useEffect(() => {
    for (let idx in rcpTable) {
      const rcp = rcpTable[idx];
      rcp.updateLimit(canvasWidth - RCP_SIZE, canvasHeight - RCP_SIZE);
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
  left: 500px;
`;
const S_Btn = styled.button``;
