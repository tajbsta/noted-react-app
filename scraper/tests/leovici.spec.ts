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
import Leovici from '../src/lib/vendors/leovici';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/LEOVICI.json';

describe(`Leovici`, () => {
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

      const orderData = await Leovici.parse(VENDOR_CODES.LEOVICI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2309',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Pullover Crew - Bone',
            price: 85.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/CREAM-CREWNECK-SWEATER-FRONT_compact_cropped.jpg?v=1624545125'
          },
          {
            name: 'Drop Cut T Shirt - Deep Maroon',
            price: 55.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/LEOVICI-CURVEHEM-MAROON-FRONT_compact_cropped.jpg?v=1629326351'
          },
          {
            name: 'Patch Beanie - Black',
            price: 35.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/LEOVICI-BLACK-BEANIE-FRONT_compact_cropped.jpg?v=1636516218'
          }
        ],
        vendor: VENDOR_CODES.LEOVICI,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1</span><br/>', '2</span><br/>');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Leovici.parse(VENDOR_CODES.LEOVICI, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '2309',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Pullover Crew - Bone (1)',
            price: 85.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/CREAM-CREWNECK-SWEATER-FRONT_compact_cropped.jpg?v=1624545125'
          },
          {
            name: 'Pullover Crew - Bone (2)',
            price: 85.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/CREAM-CREWNECK-SWEATER-FRONT_compact_cropped.jpg?v=1624545125'
          },
          {
            name: 'Drop Cut T Shirt - Deep Maroon',
            price: 55.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/LEOVICI-CURVEHEM-MAROON-FRONT_compact_cropped.jpg?v=1629326351'
          },
          {
            name: 'Patch Beanie - Black',
            price: 35.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/1830/0563/products/LEOVICI-BLACK-BEANIE-FRONT_compact_cropped.jpg?v=1636516218'
          }
        ],
        vendor: VENDOR_CODES.LEOVICI,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Leovici.parse(VENDOR_CODES.LEOVICI, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
