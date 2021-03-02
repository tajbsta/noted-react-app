import { nanoid } from 'nanoid';
import {
  BELOW_AVERAGE,
  EXCELLENT,
  FAIR,
  GREAT,
} from './constants/returns/scores';

import one from './assets/img/1.png';
import two from './assets/img/2.png';
import three from './assets/img/3.png';
import four from './assets/img/4.png';

export const scanned = [
  {
    distributor: 'Nordstom',
    productName: 'Long Sleeve White Shirt',
    price: 58.29,
    compensationType: 'Cash back',
    returnScore: EXCELLENT,
    id: nanoid(),
    image: one,
  },
  {
    distributor: 'Balenciaga',
    productName: 'White Jumper',
    price: 240.0,
    compensationType: 'Store Credits',
    returnScore: GREAT,
    id: nanoid(),
    image: two,
  },
  {
    distributor: 'Nike',
    productName: 'Metcon 6',
    price: 39.69,
    compensationType: 'Cash back',
    returnScore: FAIR,
    id: nanoid(),
    image: three,
  },
  {
    distributor: 'Amazon',
    productName: 'Yoga Mat Eco Friendly',
    price: 58.29,
    compensationType: 'Cash back',
    returnScore: EXCELLENT,
    id: nanoid(),
    image: four,
  },
  {
    distributor: 'Amazon',
    productName: 'Resistance Bands Se',
    price: 58.29,
    compensationType: 'Store Credits',
    returnScore: GREAT,
    id: nanoid(),
    image: two,
  },
  {
    distributor: 'Michael Kors',
    productName: 'Monogram print tote',
    price: 407.0,
    compensationType: 'Cash back',
    returnScore: BELOW_AVERAGE,
    id: nanoid(),
    image: three,
  },
];
