import React, { useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';


const Line = (props) => {
  useEffect(() => {
    const line = document.getElementById(props.idx);
    const text = props.line[0];
    if (props.idx === 'l0' || props.line[1] === 'user-command') {
      line.innerText = text;
      return;
    }
    for (let i = 0; i < text.length; i++) {
      setTimeout(() => line.innerText = text.slice(0, i + 1), i * 30);
    }
  }, []);
  return (
    <p className={props.line[1]} id={props.idx}>
    </p>
  );
};

export default Line;
