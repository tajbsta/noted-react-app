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
import SwetTailor from '../src/lib/vendors/swetTailor';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/SWETTAILOR.json';

describe(`Swet Tailor`, () => {
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

      const orderData = await SwetTailor.parse(VENDOR_CODES.SWETTAILOR, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '36888',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Polished Shirt',
            price: 89.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST__0003_ST-6003LB_LIGHTBLUE_01_x512.jpg?v=1603381616'
          },
          {
            name: 'Lightweight SWET-Hoodie',
            price: 75.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST-FTH2006PB_PEARLBLUSH_01_x512.jpg?v=1631117515'
          },
          {
            name: 'SWET Jogger',
            price: 75.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST_0001_ST-FTH2006HG_HEATHER-ALLcopy_x512.jpg?v=1631057528'
          }
        ],
        vendor: VENDOR_CODES.SWETTAILOR,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);

      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace('1 X', '2 X');

      updatedPayload.decodedBody = updatedBody;

      const orderData = await SwetTailor.parse(VENDOR_CODES.SWETTAILOR, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '36888',
        orderDate: Number(payload.internalDate),
        products: [
          {
            name: 'Polished Shirt (1)',
            price: 89.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST__0003_ST-6003LB_LIGHTBLUE_01_x512.jpg?v=1603381616'
          },
          {
            name: 'Polished Shirt (2)',
            price: 89.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST__0003_ST-6003LB_LIGHTBLUE_01_x512.jpg?v=1603381616'
          },
          {
            name: 'Lightweight SWET-Hoodie',
            price: 75.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST-FTH2006PB_PEARLBLUSH_01_x512.jpg?v=1631117515'
          },
          {
            name: 'SWET Jogger',
            price: 75.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/0021/2602/0666/products/ST_0001_ST-FTH2006HG_HEATHER-ALLcopy_x512.jpg?v=1631057528'
          }
        ],
        vendor: VENDOR_CODES.SWETTAILOR,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(SwetTailor.parse(VENDOR_CODES.SWETTAILOR, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
