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
import Freebird from '../src/lib/vendors/freebird';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/FREEBIRD.json';

describe(`Freebird`, () => {
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
      const orderData = await Freebird.parse(VENDOR_CODES.FREEBIRD, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '624081',
        orderDate: 0,
        products: [
          {
            name: 'Baby Coal White Snake',
            price: 79.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1288/8475/products/9.8.21-baby-coal-white-snake-lifestyle-summer-4_compact_cropped.gif?v=1634166080'
          },
          {
            name: 'Baby Coal Cognac',
            price: 79.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1288/8475/products/8.17.21-baby-coal-cognac-lifestyle-summer-2_compact_cropped.gif?v=1634165842'
          }
        ],
        vendor: VENDOR_CODES.FREEBIRD,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</span>`, `2</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Freebird.parse(VENDOR_CODES.FREEBIRD, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '624081',
        orderDate: 0,
        products: [
          {
            name: 'Baby Coal White Snake (1)',
            price: 79.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1288/8475/products/9.8.21-baby-coal-white-snake-lifestyle-summer-4_compact_cropped.gif?v=1634166080'
          },
          {
            name: 'Baby Coal White Snake (2)',
            price: 79.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1288/8475/products/9.8.21-baby-coal-white-snake-lifestyle-summer-4_compact_cropped.gif?v=1634166080'
          },
          {
            name: 'Baby Coal Cognac',
            price: 79.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1288/8475/products/8.17.21-baby-coal-cognac-lifestyle-summer-2_compact_cropped.gif?v=1634165842'
          }
        ],
        vendor: VENDOR_CODES.FREEBIRD,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Freebird.parse(VENDOR_CODES.FREEBIRD, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
