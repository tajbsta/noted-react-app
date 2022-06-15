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
import AmazingLace from '../src/lib/vendors/amazingLace';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/AMAZINGLACE.json';

describe(`Amazing Lace`, () => {
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
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AmazingLace.parse(VENDOR_CODES.AMAZINGLACE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '247234',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'MATISSE Pacific Platform Sandal Vegan Peta Approved - 8 / White',
            price: 48.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0209/6062/products/3CF0E7F6-BCD3-4482-AE75-371A665F5175_100x100_crop_center@2x.jpg?v=1650641859'
          },
          {
            name: 'MATISSE Ocean Ave Golden Honey Sandals Vegan Peta Approved - 8 / Golden Honey',
            price: 48.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0209/6062/products/E4FFD587-E5E2-4E0E-9817-936171750B29_100x100_crop_center@2x.jpg?v=1651776851'
          }
        ],
        vendor: VENDOR_CODES.AMAZINGLACE,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('x 1</p>', 'x 2</p>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await AmazingLace.parse(VENDOR_CODES.AMAZINGLACE, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '247234',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'MATISSE Pacific Platform Sandal Vegan Peta Approved - 8 / White (1)',
            price: 48.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0209/6062/products/3CF0E7F6-BCD3-4482-AE75-371A665F5175_100x100_crop_center@2x.jpg?v=1650641859'
          },
          {
            name: 'MATISSE Pacific Platform Sandal Vegan Peta Approved - 8 / White (2)',
            price: 48.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0209/6062/products/3CF0E7F6-BCD3-4482-AE75-371A665F5175_100x100_crop_center@2x.jpg?v=1650641859'
          },
          {
            name: 'MATISSE Ocean Ave Golden Honey Sandals Vegan Peta Approved - 8 / Golden Honey',
            price: 48.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0209/6062/products/E4FFD587-E5E2-4E0E-9817-936171750B29_100x100_crop_center@2x.jpg?v=1651776851'
          }
        ],
        vendor: VENDOR_CODES.AMAZINGLACE,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(AmazingLace.parse(VENDOR_CODES.AMAZINGLACE, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
