interface IVendor {
  _id?: string;
  code: string;
  name: string;
  shipping: string;
  refund_amount: string;
  receipt_needed: string;
  refund_time_frame: number;
  physical_store: string;
  rating: number;
  policy: string;
  website: string;
  keyword: string;
  thumbnail: string;
  from_emails: string;
}

export default IVendor;
