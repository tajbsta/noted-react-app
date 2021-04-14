import React, { useState } from 'react';
import Off from '../assets/icons/Off.svg';
import OnContainer from '../assets/icons/Rectangle.svg';
import OnCheckPath from '../assets/icons/Check.svg';

export default function NotedCheckbox({
  checked = false,
  onChangeState = () => {},
  disabled = false,
}) {
  return (
    <div
      onMouseDown={() => {
        console.log('Hello');
      }}
      style={{
        width: 16,
        height: 16,
        backgroundImage: `url(${checked ? OnContainer : Off})`,
        display: 'flex',
        padding: 2,
        cursor: 'pointer',
        zIndex: 999,
      }}
      onClick={() => {
        if (!disabled) {
          onChangeState();
        }
      }}
    >
      {checked && <img src={OnCheckPath} alt='' />}
    </div>
  );
}
