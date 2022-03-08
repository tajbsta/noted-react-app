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
import Untuckit from '../src/lib/vendors/untuckit';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/UNTUCKIT.json';

describe('Untuckit', () => {
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
      const orderData = await Untuckit.parse(VENDOR_CODES.UNTUCKIT, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '3305945',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Wine Bottle Sock - One Size / Regular Fit / Grey',
            price: 14.5,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0129/1072/products/WINE-BOTTLES-UNTUCKIT-SOCKS-GREY_medium.jpg?v=1583525912'
          },
          {
            name: 'Trucker Hat - One Size / Regular Fit / Navy',
            price: 28.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0129/1072/products/UNTUCKIT-HAT-NAVY-1_27ae342a-bd62-46c8-8cd9-1cbd9116716d_medium.jpg?v=1632772694'
          }
        ],
        vendor: VENDOR_CODES.UNTUCKIT,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('Quantity: 1', 'Quantity: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Untuckit.parse(VENDOR_CODES.UNTUCKIT, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '3305945',
        orderDate: 1634860800000,
        products: [
          {
            name: 'Wine Bottle Sock - One Size / Regular Fit / Grey (1)',
            price: 14.5,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0129/1072/products/WINE-BOTTLES-UNTUCKIT-SOCKS-GREY_medium.jpg?v=1583525912'
          },
          {
            name: 'Wine Bottle Sock - One Size / Regular Fit / Grey (2)',
            price: 14.5,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0129/1072/products/WINE-BOTTLES-UNTUCKIT-SOCKS-GREY_medium.jpg?v=1583525912'
          },
          {
            name: 'Trucker Hat - One Size / Regular Fit / Navy',
            price: 28.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0129/1072/products/UNTUCKIT-HAT-NAVY-1_27ae342a-bd62-46c8-8cd9-1cbd9116716d_medium.jpg?v=1632772694'
          }
        ],
        vendor: VENDOR_CODES.UNTUCKIT,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Untuckit.parse(VENDOR_CODES.UNTUCKIT, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
