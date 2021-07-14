export interface RawProduct {
  name: string;
  thumbnail: string;
  price: number;
  quantity?: number;
}

export interface OrderData {
  vendor: string;
  orderRef: string;
  orderDate: number;
  products: RawProduct[];
}
