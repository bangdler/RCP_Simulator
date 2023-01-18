import React, { RefObject, useRef } from 'react';
import styled from 'styled-components';

import Canvas from '@/components/Canvas';
import { useClientWidthHeight } from '@/hooks/useClientWidthHeight';

export default function Main() {
  const mainRef: RefObject<HTMLElement> = useRef(null);
  const clientRect = useClientWidthHeight(mainRef);

  return (
    <S_Main ref={mainRef}>
      <Canvas canvasWidth={clientRect.width} canvasHeight={clientRect.height} />
    </S_Main>
  );
}

const S_Main = styled.main`
  width: 400px;
  height: 400px;
  margin: 0 auto;
`;
