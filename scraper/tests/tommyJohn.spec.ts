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
import TommyJohn from '../src/lib/vendors/tommyJohn';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3.us-west-2.amazonaws.com/TOMMYJOHN.json';

describe.only('Tommy John', () => {
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
      const orderData = await TommyJohn.parse(VENDOR_CODES.TOMMYJOHN, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'SH4214338',
        orderDate: 1634601600000,
        products: [
          {
            name: "Women's Air Mesh Trim High Rise Brief",
            price: 22.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2964/7474/products/7.29_W_AIR_HRBRF_1001541_800039_Ecomm_Still_compact_cropped.jpg?v=1630098888'
          },
          {
            name: "Women's Lounge Short",
            price: 52.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2964/7474/products/W_10007771000_600009_ECOM_S_compact_cropped.jpg?v=1623952863'
          }
        ],
        vendor: VENDOR_CODES.TOMMYJOHN,
        emailId: payload.id
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`1</span> <br style="font-family`, `2</span> <br style="font-family`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await TommyJohn.parse(VENDOR_CODES.TOMMYJOHN, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'SH4214338',
        orderDate: 1634601600000,
        products: [
          {
            name: "Women's Air Mesh Trim High Rise Brief (1)",
            price: 22.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2964/7474/products/7.29_W_AIR_HRBRF_1001541_800039_Ecomm_Still_compact_cropped.jpg?v=1630098888'
          },
          {
            name: "Women's Air Mesh Trim High Rise Brief (2)",
            price: 22.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2964/7474/products/7.29_W_AIR_HRBRF_1001541_800039_Ecomm_Still_compact_cropped.jpg?v=1630098888'
          },
          {
            name: "Women's Lounge Short",
            price: 52.0,
            thumbnail:
              'https://cdn.shopify.com/s/files/1/2964/7474/products/W_10007771000_600009_ECOM_S_compact_cropped.jpg?v=1623952863'
          }
        ],
        vendor: VENDOR_CODES.TOMMYJOHN,
        emailId: payload.id
      });
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(TommyJohn.parse(VENDOR_CODES.TOMMYJOHN, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
