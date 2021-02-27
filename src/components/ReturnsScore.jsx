import { isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import { RETURN_SCORES } from '../constants/returns/scores';

function ReturnScore({ score }) {
  const [validScore, setValidScore] = useState({});

  useEffect(() => {
    const [returnScore] = RETURN_SCORES.filter(({ name }) =>
      isEqual(name, score)
    );
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

export default ReturnScore;
