import { isEqual } from "lodash";
import React from "react";
import { RETURN_SCORES } from "../constants/returns/scores";

function ReturnScore({ score }: { score: string }) {
  const getReturnScore = (score: string) => {
    const [returnScore] = RETURN_SCORES.filter(({ name }) =>
      isEqual(name, score)
    );
    return returnScore;
  };

  return <img src={getReturnScore(score).icon} alt="" />;
}

export default ReturnScore;
