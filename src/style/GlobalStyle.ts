import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

export const GlobalStyle = createGlobalStyle`
  ${reset}
  body {
    overflow: hidden;
  }
  
  button {
    border: none;
    cursor: pointer;
    background: none;
    font-family: 'Gamja Flower';
    padding: 0;
  }
`;
