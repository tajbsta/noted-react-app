import * as chai from 'chai';
import * as sinon from 'sinon';
import * as chaiAsPromised from 'chai-as-promised';
import { expect } from 'chai';
import axios from 'axios';
import * as moment from 'moment-timezone';
import * as jsdom from 'jsdom';

import { IEmailPayload } from '../src/models';
import { VENDOR_CODES } from '../src/constants';
import * as helpers from '../src/lib/helpers';
import PrettyLittleThing from '../src/lib/vendors/prettyLittleThing';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/PLT.json';

describe.only(`Pretty Little Thing`, () => {
  let sandbox: sinon.SinonSandbox;
  let payload: IEmailPayload = {
    raw: '',
    id: '',
    internalDate: '',
    decodedBody: ''
  };

  before(async () => {
    const res = await axios.get(TEST_DATA_URL);

    payload.decodedBody = Buffer.from(res.data.raw, 'base64').toString('utf-8');
    payload.id = res.data.id;
    payload.internalDate = res.data.internalDate;
  });

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sandbox.stub(helpers, 'parseHtmlString').callsFake((body: string) => {
      const dom = new jsdom.JSDOM(body);

      return dom.window.document;
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('parse', () => {
    it('should return order data', async () => {
      const orderData = await PrettyLittleThing.parse(VENDOR_CODES.PRETTYLITTLETHING, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '522-1074090-2359417',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'PRETTYLITTLETHING Recycled Maternity Blue Zip Thru Unitard',
            price: 24.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/a/8/9/4/a894873a5c5ef377e25ba1c12586195b23923931_cmw9026_1.jpg'
          },
          {
            name: 'Maternity Multi Oversized Long Sleeve Smock Dress',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/2/c/5/2/2c52a1c7257620e51c854e1b5ea04db7451bd34b_cms9306_1.jpg'
          },
          {
            name: 'Maternity Stone Halterneck Textured Smock Dress',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/d/7/5/4/d754251d0c8ff85fd6c80c400cc01a053460e21b_cmy0354_1.jpg'
          },
          {
            name: 'Maternity Cream Knitted Rib Polo Short Sleeve Wide Leg Jumpsuit',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/e/6/4/f/e64f22c2fbe766505d37a40984cb430c02675295_cms7934_1.jpg'
          },
          {
            name: 'Maternity Cream Faux Leather Pocket Detail Shirt',
            price: 14.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/a/4/8/9/a489e3f9008f6b3c47fcec712eb797cf013c052e_cmu0170_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.PRETTYLITTLETHING,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1', 'Quantity: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await PrettyLittleThing.parse(VENDOR_CODES.PRETTYLITTLETHING, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '522-1074090-2359417',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'PRETTYLITTLETHING Recycled Maternity Blue Zip Thru Unitard (1)',
            price: 24.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/a/8/9/4/a894873a5c5ef377e25ba1c12586195b23923931_cmw9026_1.jpg'
          },
          {
            name: 'PRETTYLITTLETHING Recycled Maternity Blue Zip Thru Unitard (2)',
            price: 24.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/a/8/9/4/a894873a5c5ef377e25ba1c12586195b23923931_cmw9026_1.jpg'
          },
          {
            name: 'Maternity Multi Oversized Long Sleeve Smock Dress',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/2/c/5/2/2c52a1c7257620e51c854e1b5ea04db7451bd34b_cms9306_1.jpg'
          },
          {
            name: 'Maternity Stone Halterneck Textured Smock Dress',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/d/7/5/4/d754251d0c8ff85fd6c80c400cc01a053460e21b_cmy0354_1.jpg'
          },
          {
            name: 'Maternity Cream Knitted Rib Polo Short Sleeve Wide Leg Jumpsuit',
            price: 29.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/e/6/4/f/e64f22c2fbe766505d37a40984cb430c02675295_cms7934_1.jpg'
          },
          {
            name: 'Maternity Cream Faux Leather Pocket Detail Shirt',
            price: 14.0,
            thumbnail:
              'https://cdn-img.prettylittlething.com/a/4/8/9/a489e3f9008f6b3c47fcec712eb797cf013c052e_cmu0170_1.jpg'
          }
        ],
        vendor: VENDOR_CODES.PRETTYLITTLETHING,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(PrettyLittleThing.parse(VENDOR_CODES.PRETTYLITTLETHING, updatedPayload)).to.eventually.be.rejectedWith(
        Error
      );
    });
  });
});
