import React, { useEffect, useState } from 'react';
import { RETURN_SCORES } from '../../constants/returns/scores';

export default function ReturnScore({ score }) {
  const [validScore, setValidScore] = useState({});

  useEffect(() => {
    const returnScore = RETURN_SCORES.find(({ rating }) => rating === score);
    setValidScore(returnScore);
  }, []);

  return (
    <img
      src={validScore.icon}
      alt=''
      style={{
        width: 18,
      }}
    />
  );
}
