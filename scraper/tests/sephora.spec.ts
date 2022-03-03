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
import Sephora from '../src/lib/vendors/sephora';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SEPHORA.json';

describe(`Sephora`, () => {
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
      const orderData = await Sephora.parse(VENDOR_CODES.SEPHORA, payload);

      expect(orderData).to.be.deep.equal({
        orderRef: '39571954423',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Mini Forbidden Fig Decorative Tin Candle',
            thumbnail: 'https://www.sephora.com/sku/pbimage/2471001',
            price: 10.0
          },
          {
            name: 'GloWish Luminous Pressed Powder Foundation',
            thumbnail: 'https://www.sephora.com/sku/pbimage/2474617',
            price: 33.0
          }
        ],
        vendor: VENDOR_CODES.SEPHORA,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`Qty: 1`, `Qty: 2`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Sephora.parse(VENDOR_CODES.SEPHORA, updatedPayload);

      expect(orderData).to.be.deep.equal({
        orderRef: '39571954423',
        orderDate: 1634515200000,
        products: [
          {
            name: 'Mini Forbidden Fig Decorative Tin Candle (1)',
            thumbnail: 'https://www.sephora.com/sku/pbimage/2471001',
            price: 10.0
          },
          {
            name: 'Mini Forbidden Fig Decorative Tin Candle (2)',
            thumbnail: 'https://www.sephora.com/sku/pbimage/2471001',
            price: 10.0
          },
          {
            name: 'GloWish Luminous Pressed Powder Foundation',
            thumbnail: 'https://www.sephora.com/sku/pbimage/2474617',
            price: 33.0
          }
        ],
        vendor: VENDOR_CODES.SEPHORA,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Sephora.parse(VENDOR_CODES.SEPHORA, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
