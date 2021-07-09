export interface RawProduct {
  name: string;
  thumbnail: string;
  price: number;
  quantity?: number;
}

export interface OrderData {
  vendor: string;
  order_ref: string;
  order_date: number;
  products: RawProduct[];
}
