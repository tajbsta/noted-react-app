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
import Express from '../src/lib/vendors/express';

chai.use(chaiAsPromised);
moment.tz.setDefault('Etc/UTC');

const TEST_DATA_URL = 'https://noted-scrape-test.s3-us-west-2.amazonaws.com/EXPRESS.json';

describe('Express', () => {
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
      const orderData = await Express.parse(VENDOR_CODES.EXPRESS, payload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'EXPR104109456CT',
        orderDate: 1618358400000,
        products: [{ name: 'HIGH WAISTED WHITE SKINNY JEANS', thumbnail: '', price: 80 }],
        vendor: VENDOR_CODES.EXPRESS,
        emailId: '178d1f2d14740a52'
      });
    });

    it('should return order data with quantity handled', async () => {
      const updatedPayload = Object.assign({}, payload);
      let updatedBody = updatedPayload.decodedBody;

      updatedBody = updatedBody.replace(
        `<font face="Arial, Helvetica, sans-serif" style="color:#000000; font-size:12px;">1`,
        `<font face="Arial, Helvetica, sans-serif" style="color:#000000; font-size:12px;">3</font>`
      );

      updatedPayload.decodedBody = updatedBody;

      const orderData = await Express.parse(VENDOR_CODES.EXPRESS, updatedPayload);
      expect(orderData).to.be.deep.equal({
        orderRef: 'EXPR104109456CT',
        orderDate: 1618358400000,
        products: [
          {
            name: 'HIGH WAISTED WHITE SKINNY JEANS (1)',
            thumbnail: '',
            price: 80
          },
          {
            name: 'HIGH WAISTED WHITE SKINNY JEANS (2)',
            thumbnail: '',
            price: 80
          },
          {
            name: 'HIGH WAISTED WHITE SKINNY JEANS (3)',
            thumbnail: '',
            price: 80
          }
        ],
        vendor: VENDOR_CODES.EXPRESS,
        emailId: '178d1f2d14740a52'
      });
    });

    it('should return a single product', async () => {
      const orderData = await Express.parse(VENDOR_CODES.EXPRESS, payload);

      expect(orderData.products.length).to.be.equal(1);
    });

    it('should throw error if contains lacking data', () => {
      const updatedPayload = Object.assign({}, payload);
      updatedPayload.decodedBody = '<body>Invalid Body</body>';
      expect(Express.parse(VENDOR_CODES.EXPRESS, updatedPayload)).to.eventually.be.rejectedWith(Error);
    });
  });
});
