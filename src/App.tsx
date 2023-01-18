import React from 'react';
import styled from 'styled-components';

import { GlobalStyle } from '@/style/GlobalStyle';
import Main from '@/pages/Main';

function App() {
  return (
    <>
      <GlobalStyle />
      <Main />
    </>
  );
}

const StyledDiv = styled.div`
  color: blue;
`;

export default App;
