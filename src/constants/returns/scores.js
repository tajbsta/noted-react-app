import BelowIconSvg from "../../assets/icons/Below.svg";
import ExcellentIconSvg from "../../assets/icons/Excellent.svg";
import FairIconSvg from "../../assets/icons/Fair.svg";
import GreatIconSVg from "../../assets/icons/Great.svg";
import QuestionMarkSvg from "../../assets/icons/QuestionMark";

export const EXCELLENT = "excellent";
export const GREAT = "great";
export const FAIR = "fair";
export const BELOW_AVERAGE = "below_average";
export const NO_INFO = "no_info";

const EXCELLENT_RETURNS = "Excellent Returns";
const GREAT_RETURNS = "Great Returns";
const FAIR_RETURNS = "Fair Returns";
const BELOW_AVERAGE_RETURNS = "Below Average";
const NO_INFO_ON_RATING = "No info on rating";

export const RETURN_SCORES = [
  {
    rating: 4,
    name: EXCELLENT,
    title: EXCELLENT_RETURNS,
    icon: ExcellentIconSvg,
  },
  {
    rating: 3,
    name: GREAT,
    title: GREAT_RETURNS,
    icon: GreatIconSVg,
  },
  {
    rating: 2,
    name: FAIR,
    title: FAIR_RETURNS,
    icon: FairIconSvg,
  },
  {
    rating: 1,
    name: BELOW_AVERAGE,
    title: BELOW_AVERAGE_RETURNS,
    icon: BelowIconSvg,
  },
  {
    rating: 0,
    name: NO_INFO,
    title: NO_INFO_ON_RATING,
    icon: QuestionMarkSvg,
  },
];
