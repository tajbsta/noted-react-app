# noted-react-app-scraper

To Start Development you need to:

1. Install all dependencies

### `npm install`

2. Start Development Mode

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3030/scraper.js](http://localhost:3030/scraper.js) to view it in the browser.

## Usage
- FE can now use `window.notedScraper` function 
Payload
```
vendors - required
rawEmails - required

```
#### Schemas
```
vendor

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
```
```
rawEmails

interface IEmailPayload {
  raw: string;
  internalDate: string;
  decodedBody?: string;
}
```