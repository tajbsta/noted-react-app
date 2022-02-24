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
import MollyGreen from '../src/lib/vendors/mollyGreen';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/MOLLYGREEN.json';

describe.only(`Molly Green`, () => {
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
      const orderData = await MollyGreen.parse(VENDOR_CODES.MOLLYGREEN, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '86437',
        orderDate: 0,
        products: [
          {
            name: 'Maddy Dress',
            price: 63.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0380/8211/7771/products/molly-green-maddy-dress-dressy-dresses-108935_compact_cropped.jpg?v=1633103336'
          },
          {
            name: 'Miriam Wrap Dress',
            price: 69.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0380/8211/7771/products/molly-green-miriam-wrap-dress-casual-dresses-882631_compact_cropped.jpg?v=1633371379'
          }
        ],
        vendor: VENDOR_CODES.MOLLYGREEN,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</span>`, `2</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await MollyGreen.parse(VENDOR_CODES.MOLLYGREEN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '86437',
        orderDate: 0,
        products: [
          {
            name: 'Maddy Dress (1)',
            price: 63.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0380/8211/7771/products/molly-green-maddy-dress-dressy-dresses-108935_compact_cropped.jpg?v=1633103336'
          },
          {
            name: 'Maddy Dress (2)',
            price: 63.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0380/8211/7771/products/molly-green-maddy-dress-dressy-dresses-108935_compact_cropped.jpg?v=1633103336'
          },
          {
            name: 'Miriam Wrap Dress',
            price: 69.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0380/8211/7771/products/molly-green-miriam-wrap-dress-casual-dresses-882631_compact_cropped.jpg?v=1633371379'
          }
        ],
        vendor: VENDOR_CODES.MOLLYGREEN,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(MollyGreen.parse(VENDOR_CODES.MOLLYGREEN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
