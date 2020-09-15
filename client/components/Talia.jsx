import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';

const Styled = {
  Global: createGlobalStyle`
    html {
      height: 100%;
      position: relative;
      width: 100%;
    }
    body {
      background-color: rgb(40, 42, 55);
      box-style: border-box;
      color: rgb(190, 195, 205);
      font-family: monospace, sans-serif;
      font-size: 32px;
      font-size: 2vmax;
      height: 100%;
      margin: 0;
      overflow: hidden;
      position: relative;
      width: 100%;
      user-select: none;
    }
    form {
      display: inline;
    }
    #talia {
      height: 100%;
      width: 100%;
    }
    @keyframes typing {
      from { width: 0; }
      to { width: 100%; }
    }
  `,
  Console: styled.section`
    border: 0.1rem solid rgb(190, 195, 205);
    height: 90%;
    margin: 1rem;
    padding: 1rem;
    position: relative;
    scrollbar-width: none;
    overflow-y: scroll;
    user-select: none;
    &::-webkit-scrollbar {
      display: none;
    }
    & .taliabot-response:nth-child(n + 2) {
      overflow: hidden;
      white-space: nowrap;
      animation: typing 3.5s steps(40, end);
    }
    & .user-command::before {
      content: "> ";
    }
  `,
  Line: styled.p`
    margin: 0;
  `,
  Command: styled.input`
    border: 0;
    background-color: rgb(40, 42, 55);
    color: rgb(190, 195, 205);
    cursor: pointer;
    font-family: monospace, sans-serif;
    font-size: 32px;
    font-size: 2vmax;
    &:focus {
      outline: none;
    }
  `,
  Submit: styled.input`
    display: none;
  `,
};

const Talia = () => {
  const greetings = [
    ['Hi, I am Taliabot!', 'taliabot'],
    ['My memory component is under the weather. Please tell me your name :)', 'taliabot-response']
  ];

  const [terminal, type] = useState([...greetings]);

  const typeConsole = (event) => {
    event.preventDefault();
    type(terminal.concat([[event.target.children[0].value, 'user-command']]));
    event.target.children[0].value = '';
  };

  const focus = () => {
    document.getElementById('command').focus();
  }

  useEffect(() => {
    const view = document.getElementById('console');
    view.scrollTop = view.scrollHeight - view.clientHeight;
  });

  return (
    <Styled.Console id="console" onClick={focus}>
      <Styled.Global />
        {terminal.map((line, idx) => (
          <Styled.Line key={'l' + idx} className={line[1]}>
            {line[0]}
          </Styled.Line>
        ))}
        <form onSubmit={typeConsole} spellCheck="none">
            > <Styled.Command id="command" autoFocus/>
            <Styled.Submit type="submit" />
        </form>
    </Styled.Console>
  );
};

export default Talia;
