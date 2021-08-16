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
import WhiteHouse from '../src/lib/vendors/whiteHouse';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/WHITEHOUSE.json';

describe('WHITEHOUSE', () => {
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
      const orderData = await WhiteHouse.parse(VENDOR_CODES.WHITEHOUSE, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '316057792',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Woven-Hem Tunic Tee',
            thumbnail: 'http://www.whitehouseblackmarket.com/Product_Images/570302871_1304_thumb.jpg',
            price: 23.99
          }
        ],
        vendor: VENDOR_CODES.WHITEHOUSE,
        emailId: '178d0f9af96c0015'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('QTY: 1', 'QTY: 2');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await WhiteHouse.parse(VENDOR_CODES.WHITEHOUSE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '316057792',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Woven-Hem Tunic Tee (1)',
            thumbnail: 'http://www.whitehouseblackmarket.com/Product_Images/570302871_1304_thumb.jpg',
            price: 23.99
          },
          {
            name: 'Woven-Hem Tunic Tee (2)',
            thumbnail: 'http://www.whitehouseblackmarket.com/Product_Images/570302871_1304_thumb.jpg',
            price: 23.99
          }
        ],
        vendor: VENDOR_CODES.WHITEHOUSE,
        emailId: '178d0f9af96c0015'
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(WhiteHouse.parse(VENDOR_CODES.WHITEHOUSE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
