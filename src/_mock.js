import { nanoid } from "nanoid";
import { EXCELLENT, FAIR, GREAT } from "./constants/returns/scores";

export const returnableMockData = [
  {
    distributor: "Nordstom",
    productName: "Long Sleeve White Shirt",
    price: 58.29,
    compensationType: "Cash back",
    returnScore: EXCELLENT,
    id: nanoid(),
  },
  {
    distributor: "Balenciaga",
    productName: "White Jumper",
    price: 240.0,
    compensationType: "Store Credits",
    returnScore: GREAT,
    id: nanoid(),
  },
  {
    distributor: "Nike",
    productName: "Metcon 6",
    price: 130.0,
    compensationType: "Cash back",
    returnScore: FAIR,
    id: nanoid(),
  },
];

export const lastCallMockdata = [
  {
    distributor: "Nordstom",
    productName: "Long Sleeve White Shirt",
    price: 58.29,
    compensationType: "Cash back",
    returnScore: EXCELLENT,
    id: nanoid(),
  },
  {
    distributor: "Balenciaga",
    productName: "White Jumper",
    price: 240.0,
    compensationType: "Store Credits",
    returnScore: GREAT,
    id: nanoid(),
  },
  {
    distributor: "Nike",
    productName: "Metcon 6",
    price: 130.0,
    compensationType: "Cash back",
    returnScore: FAIR,
    id: nanoid(),
  },
];
