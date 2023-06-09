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
import Chicos from '../src/lib/vendors/chicos';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/CHICOS.json';

describe('Chicos', () => {
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
      const orderData = await Chicos.parse(VENDOR_CODES.CHICOS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: '125250293',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Microfiber Tank',
            thumbnail: 'https://www.chicos.com/Product_Images/570243933_176_thumb.jpg',
            price: 19
          }
        ],
        vendor: VENDOR_CODES.CHICOS,
        emailId: '178d0f49ec51224a'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(`12px">1</span>`, `12px">3</span>`);

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Chicos.parse(VENDOR_CODES.CHICOS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: '125250293',
        orderDate: 1618358400000,
        products: [
          {
            name: 'Microfiber Tank (1)',
            thumbnail: 'https://www.chicos.com/Product_Images/570243933_176_thumb.jpg',
            price: 19
          },
          {
            name: 'Microfiber Tank (2)',
            thumbnail: 'https://www.chicos.com/Product_Images/570243933_176_thumb.jpg',
            price: 19
          },
          {
            name: 'Microfiber Tank (3)',
            thumbnail: 'https://www.chicos.com/Product_Images/570243933_176_thumb.jpg',
            price: 19
          }
        ],
        vendor: VENDOR_CODES.CHICOS,
        emailId: '178d0f49ec51224a'
      });
    });

    it('should return a single product', async () => {
      const orderData = await Chicos.parse(VENDOR_CODES.CHICOS, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Chicos.parse(VENDOR_CODES.BELK, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
