import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

const Styled = {
  Global: createGlobalStyle`
    body {
      background-color: rgb(40, 42, 55);
      box-style: border-box;
      color: rgb(190, 195, 205);
      font-family: monospace, sans-serif;
      font-size: 32px;
      font-size: 2vmax;
      height: 100%;
      margin: 0;
      padding:
      position: relative;
      width: 100%;
    }
  `
};

const Talia = () => {
  return (
    <div>
      <Styled.Global />
        greetings from Talia!
    </div>
  );
};

export default Talia;
